# Reference values for the EFA in src/tools/phan-tich-du-lieu.html, checked by scripts/check-stats.mjs.
#   psych (Revelle)          - fa(fm = "pa") run to full convergence, principal(); Promax (unnormalised target, for the record)
#   stats::factanal          - maximum likelihood, run to full convergence
#   GPArotation::Varimax, GPArotation::oblimin (normalize = TRUE) - rotations of the converged loadings, run to full convergence
#   EFAtools type = "SPSS"   - SPSS's PAF stopping rule and SPSS's promax (Grieder & Steiner, 2022)
#   EFAtools::SPSS_27        - published SPSS 27 FACTOR output (PAF, varimax, promax) for six public correlation matrices
#   parallel analysis        - mean and 95th percentile of eigenvalues of 2,000 random normal data sets (set.seed(1))
# Data: the tool's built-in sample (scripts/fixtures/efa-data/sample.csv, written from sampleData() after the tool's filters),
# psych::bfi (25 items, complete cases) and the EFAtools correlation matrices. Writes scripts/fixtures/efa-reference.json.
# Run from the repository root:  Rscript scripts/efa_reference.R   (install.packages(c("psych", "GPArotation", "EFAtools", "jsonlite")))
suppressPackageStartupMessages({ library(psych); library(GPArotation); library(EFAtools); library(jsonlite) })
ns <- asNamespace("EFAtools")
um <- function(m) if (is.null(m)) NULL else { m <- as.matrix(unclass(m)); matrix(round(as.numeric(m), 10), nrow(m)) }

pa_tight <- function(r, k) fa(r, nfactors = k, fm = "pa", rotate = "none", SMC = TRUE, min.err = 1e-13, max.iter = 100000, warnings = FALSE)$loadings[, 1:k, drop = FALSE]
ml_tight <- function(r, k, n) {
  for (fr in c(1, 10, 100, 1e4, 1e7)) {
    f <- tryCatch(factanal(covmat = r, factors = k, n.obs = n, rotation = "none",
                           control = list(nstart = 1, lower = 0.005, opt = list(factr = fr, pgtol = 0, maxit = 100000))), error = function(e) NULL)
    if (!is.null(f)) return(c(f, list(factr = fr)))
  }
  stop("factanal failed")
}
spss_pro <- function(L) ns$.rotate_promax(L, normalize = TRUE, P_type = "norm", precision = 1e-10, order_type = "ss_factors", varimax_type = "kaiser", k = 4)
rotations <- function(L) {
  if (ncol(L) < 2) return(list(L = um(L)))
  ob <- GPArotation::oblimin(L, normalize = TRUE, eps = 1e-12, maxit = 100000)
  pr <- spss_pro(L); pp <- psych::Promax(L, m = 4)
  list(L = um(L), varimax = um(GPArotation::Varimax(L, normalize = TRUE, eps = 1e-12, maxit = 100000)$loadings),
       promax_spss = list(pattern = um(pr$rot_loadings), phi = um(pr$Phi)),
       promax_psych = list(pattern = um(pp$loadings), phi = um(pp$Phi)),
       oblimin = list(pattern = um(ob$loadings), phi = um(ob$Phi)))
}
one <- function(r, k, n) {
  r <- as.matrix(r); dimnames(r) <- NULL
  pa <- pa_tight(r, k); ml <- ml_tight(r, k, n); pc <- principal(r, nfactors = k, rotate = "none")$loadings[, 1:k, drop = FALSE]
  sp <- EFA(r, n_factors = k, N = n, method = "PAF", rotation = "promax", type = "SPSS")
  sv <- EFA(r, n_factors = k, N = n, method = "PAF", rotation = "varimax", type = "SPSS")
  list(k = k, n = n, smc = round(unname(smc(r)), 10),
       paf = c(rotations(pa), list(h2 = round(unname(rowSums(pa^2)), 10))),
       ml = c(rotations(ml$loadings[, 1:k, drop = FALSE]), list(psi = round(unname(ml$uniquenesses), 10), stat = unname(ml$STATISTIC), dof = unname(ml$dof), factr = ml$factr)),
       pc = rotations(pc),
       spss_default = list(L = um(sp$unrot_loadings), h2 = round(unname(sp$h2), 10), iter = sp$iter,
                           varimax = um(sv$rot_loadings), pattern = um(sp$rot_loadings), phi = um(sp$Phi)))
}
par_ref <- function(n, p, reps = 2000) {
  set.seed(1); ev <- replicate(reps, eigen(cor(matrix(rnorm(n * p), n)), symmetric = TRUE, only.values = TRUE)$values)
  list(mean = round(rowMeans(ev), 6), p95 = round(apply(ev, 1, quantile, 0.95), 6))
}

out <- list()
s <- read.csv("scripts/fixtures/efa-data/sample.csv")
iv <- s[, grep("^(PEOU|PU)", names(s))]; dv <- s[, grep("^BI", names(s))]
out$sample_iv <- c(one(cor(iv), 2, nrow(s)), list(parallel = par_ref(nrow(s), ncol(iv))))
out$sample_dv <- one(cor(dv), 1, nrow(s))
b <- na.omit(psych::bfi[, 1:25]); rb <- cor(b)
out$bfi <- c(one(rb, 5, nrow(b)), list(R = round(unname(rb), 12), parallel = par_ref(nrow(b), 25)))
spss_cases <- list(IDS_2 = list(r = IDS2_R, n = 1991), WJIV_3_5 = list(r = WJIV_ages_3_5$cormat, n = 435),
                   baseline = list(r = test_models$baseline$cormat, n = 500), case_1a = list(r = test_models$case_1a$cormat, n = 500),
                   case_6b = list(r = test_models$case_6b$cormat, n = 500), case_11b = list(r = test_models$case_11b$cormat, n = 500))
for (nm in names(spss_cases)) {
  cs <- spss_cases[[nm]]; ref <- SPSS_27[[nm]]; k <- ncol(ref$paf_load)
  r <- as.matrix(cs$r); dimnames(r) <- NULL
  sp <- EFA(r, n_factors = k, N = cs$n, method = "PAF", rotation = "promax", type = "SPSS", max_iter = 500)
  out[[paste0("spss_", nm)]] <- list(k = k, n = cs$n, R = round(r, 12),
    spss27 = list(L = um(ref$paf_load), varimax = um(ref$var_load), pattern = um(ref$pro_load), phi = um(ref$pro_phi)),
    efatools = list(L = um(sp$unrot_loadings), pattern = um(sp$rot_loadings), phi = um(sp$Phi), iter = sp$iter))
}
out$versions <- list(R = R.version.string, psych = as.character(packageVersion("psych")), GPArotation = as.character(packageVersion("GPArotation")),
                     EFAtools = as.character(packageVersion("EFAtools")))
writeLines(toJSON(out, digits = NA, auto_unbox = TRUE, matrix = "rowmajor"), "scripts/fixtures/efa-reference.json")
cat("wrote scripts/fixtures/efa-reference.json\n")
