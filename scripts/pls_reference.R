# Reference values from two R implementations of PLS-SEM for scripts/check-pls.mjs:
#   seminr (Ray, Danks & Calero Valdez; GPL-3) - every estimate, plus a 5,000-sample bootstrap (its own RNG);
#   cSEM (Rademaker & Schuberth; GPL-3)        - paths, loadings, weights, R², as a second, independent check.
# Both are run with the SmartPLS defaults: path weighting, initial weights 1, stop criterion 1e-7, 300 iterations,
# missing values replaced by the indicator mean. Reads scripts/fixtures/pls-data/*.csv, writes r-results.json there.
# Run from the repository root:  Rscript scripts/pls_reference.R   (install.packages(c("seminr", "cSEM", "jsonlite")))
suppressPackageStartupMessages({ library(seminr); library(cSEM); library(jsonlite) })
dir <- "scripts/fixtures/pls-data"

cases <- list(
  sample = list(data = "sample",
    cons = list(CL = c("CL1", "CL2", "CL3", "CL4"), GT = c("GT1", "GT2", "GT3"), HL = c("HL1", "HL2", "HL3", "HL4"),
                NT = c("NT1", "NT2", "NT3"), TT = c("TT1", "TT2", "TT3", "TT4")),
    modes = c(CL = "A", GT = "A", HL = "A", NT = "A", TT = "A"),
    paths = list(c("CL", "GT"), c("CL", "HL"), c("GT", "HL"), c("HL", "NT"), c("HL", "TT"), c("NT", "TT"), c("CL", "TT")),
    seed = 123),
  formative = list(data = "formative",
    cons = list(FQ = c("FQ1", "FQ2", "FQ3", "FQ4"), SAT = c("SAT1", "SAT2", "SAT3"), TRU = c("TRU1", "TRU2", "TRU3"),
                LOY = c("LOY1", "LOY2", "LOY3", "LOY4"), AGE = c("AGE")),
    modes = c(FQ = "B", SAT = "A", TRU = "A", LOY = "A", AGE = "A"),
    paths = list(c("FQ", "SAT"), c("FQ", "TRU"), c("SAT", "TRU"), c("SAT", "LOY"), c("TRU", "LOY"), c("AGE", "LOY")),
    seed = 321)
)

# cSEM's f² (construct scores of the full model) as "endogenous ~ predictor".
csem_f2 <- function(res) {
  f <- cSEM:::calculatef2(res); out <- list(); s <- res$Information$Model$structural
  for (e in rownames(f)) for (p in colnames(f)) if (s[e, p] != 0) out[[paste(e, "~", p)]] <- f[e, p]
  out
}
m2l <- function(x) { x <- as.matrix(unclass(x)); list(rows = rownames(x), cols = colnames(x), v = unname(x)) }

run <- function(cs) {
  d <- read.csv(file.path(dir, paste0(cs$data, ".csv")), na.strings = "NA")
  mm <- do.call(constructs, lapply(names(cs$cons), function(k) {
    it <- cs$cons[[k]]
    if (length(it) == 1) composite(k, single_item(it)) else composite(k, it, weights = if (cs$modes[[k]] == "B") mode_B else mode_A)
  }))
  sm <- do.call(relationships, lapply(cs$paths, function(p) paths(from = p[1], to = p[2])))
  m <- estimate_pls(d, mm, sm, maxIt = 300, stopCriterion = 7)
  s <- summary(m)
  vi <- lapply(s$validity$vif_items, function(v) as.list(v))
  va <- lapply(s$vif_antecedents, function(v) as.list(v))
  b <- bootstrap_model(m, nboot = 5000, seed = cs$seed, cores = 1)
  sb <- summary(b, alpha = 0.05)
  spec <- list()
  # Specific indirect effects along every chain of length >= 2 (enumerated here from the path list).
  walk <- function(path) {
    if (length(path) >= 3) {
      e <- specific_effect_significance(b, from = path[1], through = path[2:(length(path) - 1)], to = path[length(path)], alpha = 0.05)
      spec[[paste(path, collapse = ">")]] <<- as.list(e)
    }
    for (p in cs$paths) if (p[1] == path[length(path)]) walk(c(path, p[2]))
  }
  for (k in names(cs$cons)) walk(k)
  out <- list(
    seminr = list(version = as.character(packageVersion("seminr")), iterations = m$iterations,
      loadings = m2l(m$outer_loadings), weights = m2l(m$outer_weights), paths = m2l(s$paths), reliability = m2l(s$reliability),
      htmt = m2l(s$validity$htmt), fl = m2l(s$validity$fl_criteria), cross = m2l(s$validity$cross_loadings),
      vif_items = vi, vif_antecedents = va, f2 = m2l(s$fSquare), total = m2l(s$total_effects), total_indirect = m2l(s$total_indirect_effects),
      boot = list(nboot = 5000, seed = cs$seed, paths = m2l(sb$bootstrapped_paths), loadings = m2l(sb$bootstrapped_loadings),
        weights = m2l(sb$bootstrapped_weights), htmt = m2l(sb$bootstrapped_HTMT), total_indirect = m2l(sb$bootstrapped_total_indirect_paths),
        total = m2l(sb$bootstrapped_total_paths), specific = spec))
  )
  out$csem <- run_csem(cs, d)
  out
}

run_csem <- function(cs, d) {
  # cSEM on the mean-replaced data (cSEM does not accept missing values); "=~" with .disattenuate = FALSE is a Mode A composite.
  # Indicators get a suffix because cSEM refuses an indicator named like its construct (the single item AGE).
  dm <- d[, unlist(cs$cons)]
  for (j in seq_along(dm)) dm[is.na(dm[[j]]), j] <- mean(dm[[j]], na.rm = TRUE)
  names(dm) <- paste0(names(dm), "_i")
  meas <- vapply(names(cs$cons), function(k) paste(k, if (cs$modes[[k]] == "B") "<~" else "=~", paste0(cs$cons[[k]], "_i", collapse = " + ")), "")
  ends <- unique(vapply(cs$paths, `[`, "", 2))
  struc <- vapply(ends, function(e) paste(e, "~", paste(vapply(Filter(function(p) p[2] == e, cs$paths), `[`, "", 1), collapse = " + ")), "")
  res <- csem(dm, paste(c(meas, struc), collapse = "\n"), .disattenuate = FALSE, .tolerance = 1e-7, .iter_max = 300,
              .PLS_weight_scheme_inner = "path", .conv_criterion = "diff_absolute")
  e <- summarize(res)$Estimates
  list(version = as.character(packageVersion("cSEM")),
    paths = setNames(as.list(e$Path_estimates$Estimate), e$Path_estimates$Name),
    loadings = setNames(as.list(e$Loading_estimates$Estimate), e$Loading_estimates$Name),
    weights = setNames(as.list(e$Weight_estimates$Estimate), e$Weight_estimates$Name),
    r2 = as.list(res$Estimates$R2),
    f2 = csem_f2(res))
}

if (identical(commandArgs(TRUE), "csem")) {  # refresh only the cSEM part of an existing r-results.json
  all <- fromJSON(file.path(dir, "r-results.json"), simplifyVector = FALSE)
  for (k in names(cases)) all[[k]]$csem <- run_csem(cases[[k]], read.csv(file.path(dir, paste0(cases[[k]]$data, ".csv")), na.strings = "NA"))
} else all <- lapply(cases, run)
write(toJSON(all, auto_unbox = TRUE, digits = NA, null = "null", na = "null"), file.path(dir, "r-results.json"))
cat("wrote", file.path(dir, "r-results.json"), "\n")
