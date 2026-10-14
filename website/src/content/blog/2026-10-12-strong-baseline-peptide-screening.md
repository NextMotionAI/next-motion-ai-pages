---
title: A strong baseline sets the bar for peptide screening
description: A 100-query peptide screening replay reveals a strong fixed ranking baseline and a careful way to test whether feedback can improve on it.
date: 2026-10-12
author: Peter Shen
tags: [research, peptide-discovery]
project: peptide-mhc-binding
published: true
---

In my [opening note](/journal/2026-10-02-learning-from-feedback-in-peptide-discovery), I asked whether feedback could improve computational peptide discovery. The immediate test is narrower: in a 100-query campaign over nearly 100,000 peptides, can an adaptive selection policy recover positive screen calls faster than an allele-specific NetMHCpan ranking? Before choosing a learning algorithm, I needed a dataset that could support that comparison.

## The screening task

HLA class I alleles differ in their peptide-binding preferences, including which sequence motifs they favor. That variation makes allele transfer central to the question: a selection rule trained across alleles must make initial choices for an allele held out from its training, then decide whether feedback from that campaign should change its next choice.

Each screening task pairs one allele with an eligible 9-mer library. A query selects an untested peptide and reveals its recorded screen-call status for that allele. Fixed and adaptive selectors see the same public peptide information and have a maximum of 100 valid queries. The test is whether adaptation reaches a given number of positive calls sooner than a fixed ranking, or finds more within the budget.

## Why this screen?

I chose the published [yeast-display screen by Holec and colleagues](https://pubmed.ncbi.nlm.nih.gov/41264236/) and its [supplementary data](https://zenodo.org/records/17093099) for method development. The authors designed **97,041 distinct 9-mers** and screened them against human class I HLA alleles. Their analysis called **28,503 peptide–allele pairs positive** across 16 alleles with usable screen results. The supplement also provides NetMHCpan prediction ranks for 96,771 of those peptides. That combination gives me a large candidate library, feedback recorded by an experimental screen, and a fixed ranking to compare against.

Several other sources were less suited to a matched, budgeted replay:

| Source explored | Why I did not use it as the main screening task |
|---|---|
| [IEDB quantitative binding assays](https://www.iedb.org/) | A carefully filtered IC50 pilot left 275 peptide–allele pairs on seven selected development tasks. Fixed predictor ranking was already at or near the eight-query ceiling on six, and the tasks were concentrated in a few related alleles and studies. Adjacent KD-like assays added candidates, but the largest usable group was dominated by one prediction-selected study. |
| [IEDB qualitative binding assays](https://www.iedb.org/) | They offer more recorded calls, but assay methods, studies, and positive/negative categories need separate rules. Grouping by study sharply reduces the apparent number of comparable tasks. |
| [Measured peptide–MHC stability data](https://pmc.ncbi.nlm.nih.gov/articles/PMC4976001/) | These are half-life measurements, a different outcome from a yeast-screen call. The tested peptides were selected using a predictor, and fixed ranking already performs strongly on many provisional tasks. |
| [PIPLOM loading validation](https://academic.oup.com/bioinformaticsadvances/article/5/1/vbaf037/8051113) | Its 38 measured loading cases span only five HLA alleles and measure a different outcome. It may be useful as a small separate check, rather than the main training environment. |

I also inspected an older [community affinity resource](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.0020065) and larger [ImmuneApp](https://www.nature.com/articles/s41467-024-53296-0) and [MHC-Bench](https://www.nature.com/articles/s42003-024-05968-2) compilations. Their headline sizes do not settle which measurements are new, which have been used to train predictors, or whether they form comparable sequential screening tasks.

The Holec data make the task reproducible: each “query” reveals a call from a completed pooled screen. These virtual queries do not represent new assays or a saving in the cost of the original experiment. A peptide without a positive call has an unknown biological binding state, not a confirmed negative. Screen-call recovery is distinct from measured affinity, cellular presentation, T-cell recognition, or therapeutic efficacy.

## Allele-level patterns and the baseline

I use seven HLA-A and five HLA-B allele tasks on the training side: A\*01:01, A\*02:01, A\*03:01, A\*11:01, A\*24:02, A\*30:01, A\*30:02, B\*35:02, B\*35:03, B\*39:01, B\*55:02, and B\*58:01. The four development tasks are C\*01:02, C\*03:03, C\*04:01, and C\*12:02.

For each allele, eligible candidates are designed 9-mers observed at least once in the initial library sample (R0), with both supplied prediction ranks available. Requiring five R0 reads instead is a prespecified sensitivity check: for A\*02:01, it reduces eligible screen calls from 3,067 to 501. The primary rule is one read, applied before comparing selectors.

The four development tasks under that primary rule are below. “Called” means the study’s positive screen call. The fixed baseline sorts eligible peptides by the supplied NetMHCpan binding-affinity rank and queries them in that order. The last two columns are checkpoints at queries 16 and 100 along that unchanged order.

For allele <i>a</i>, let <i>P<sub>a</sub></i> be its eligible peptides with positive author calls, and let <i>x<sup>π</sup><sub>a,t</sub></i> be the peptide selected by method π at valid query <i>t</i>. The cumulative calls found at checkpoint <i>q</i> are

<div class="journal-equation">
<math display="block" aria-label="H sub a pi of q equals the sum from t equals one to q of an indicator that x sub a t superscript pi belongs to P sub a; one less than or equal to q less than or equal to one hundred">
  <msub><mi>H</mi><mrow><mi>a</mi><mo>,</mo><mi>π</mi></mrow></msub><mo>(</mo><mi>q</mi><mo>)</mo><mo>=</mo>
  <munderover><mo>∑</mo><mrow><mi>t</mi><mo>=</mo><mn>1</mn></mrow><mi>q</mi></munderover>
  <mn>1</mn><mo>{</mo><msubsup><mi>x</mi><mrow><mi>a</mi><mo>,</mo><mi>t</mi></mrow><mi>π</mi></msubsup><mo>∈</mo><msub><mi>P</mi><mi>a</mi></msub><mo>}</mo><mo>,</mo><mspace width="1em"/><mn>1</mn><mo>≤</mo><mi>q</mi><mo>≤</mo><mn>100</mn><mo>.</mo>
</math>
</div>

The table reports <i>H<sub>a,BA</sub>(q)</i> at <i>q</i> = 16 and <i>q</i> = 100 for fixed binding-affinity ranking. If a campaign stops early, its final count carries forward to later checkpoints. <i>H<sub>a,π</sub>(q) / q</i> is the cumulative call yield per budgeted query; <i>H<sub>a,π</sub>(q) / |P<sub>a</sub>|</i> is the fraction of eligible screen calls recovered. Neither quantity estimates biochemical binding probability.

<p class="journal-table-cue">Scroll this table horizontally to see all six columns.</p>

| HLA-C allele | Eligible peptides | Called in library | Called share | Fixed rank: calls by query 16 | Fixed rank: calls by query 100 |
|---|---:|---:|---:|---:|---:|
| C\*01:02 | 96,746 | 2,186 | 2.26% | 16 | 96 |
| C\*03:03 | 96,623 | 1,388 | 1.44% | 14 | 55 |
| C\*04:01 | 96,681 | 1,484 | 1.53% | 16 | 84 |
| C\*12:02 | 96,729 | 1,970 | 2.04% | 12 | 54 |

<figure class="journal-visual journal-chart">
  <p class="journal-visual-cue">Scroll the chart sideways to inspect both panels, or open it full size.</p>
  <div class="journal-chart-viewport" role="region" aria-label="Screening task chart; scroll horizontally to inspect both panels" tabindex="0">
    <a href="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-screening-task-bars.png"><img src="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-screening-task-bars.png" alt="Two-panel bar chart of screen-call prevalence and fixed-rank recovery on the four HLA-C development tasks" width="1800" height="967" loading="lazy" decoding="async" /></a>
  </div>
  <figcaption>The left panel shows the share of eligible peptides called positive; the right panel shows calls recovered by fixed binding-affinity ranking after 16 and 100 queries. Each bar is one development allele from the same study. These are screen calls, not measured affinity. <a href="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-screening-task-bars.png">Open full-size chart</a>.</figcaption>
</figure>

The calls are sparse, yet the fixed rank finds many of them. **The primary baseline to beat is full-library NetMHCpan binding-affinity ranking**, frozen before any feedback. It is evaluated query by query under the same 100-query budget as an adaptive policy, but ignores the results when choosing the next peptide. Across these four alleles it recovers an average of **72.25 calls by query 100**; seeded random selection averages **1.64**.

The endpoint count alone misses the question I care about. For illustration, if fixed rank reaches 40 calls at query 60 and an adaptive policy reaches 40 at query 45, the latter saves 15 replay queries at that target even if their final counts match. This is a hypothetical comparison, not an observed result. The prespecified primary score captures timing by summing cumulative calls through checkpoint <i>Q</i>, then normalizing against the maximum possible early recovery:

<div class="journal-equation">
<math display="block" aria-label="Area sub a pi of Q equals the sum from q equals one to Q of H sub a pi of q divided by the sum from q equals one to Q of the minimum of q and the size of P sub a; Q is sixteen or one hundred">
  <msub><mi>Area</mi><mrow><mi>a</mi><mo>,</mo><mi>π</mi></mrow></msub><mo>(</mo><mi>Q</mi><mo>)</mo><mo>=</mo>
  <mfrac>
    <mrow><munderover><mo>∑</mo><mrow><mi>q</mi><mo>=</mo><mn>1</mn></mrow><mi>Q</mi></munderover><msub><mi>H</mi><mrow><mi>a</mi><mo>,</mo><mi>π</mi></mrow></msub><mo>(</mo><mi>q</mi><mo>)</mo></mrow>
    <mrow><munderover><mo>∑</mo><mrow><mi>q</mi><mo>=</mo><mn>1</mn></mrow><mi>Q</mi></munderover><mi>min</mi><mo>(</mo><mi>q</mi><mo>,</mo><mo>|</mo><msub><mi>P</mi><mi>a</mi></msub><mo>|</mo><mo>)</mo></mrow>
  </mfrac><mo>,</mo><mspace width="1em"/><mi>Q</mi><mo>∈</mo><mo>{</mo><mn>16</mn><mo>,</mo><mn>100</mn><mo>}</mo><mo>.</mo>
</math>
</div>

Fixed ranking's equal-weight mean **Area100** across the four development alleles is **0.775**. A separate fixed library-constrained generator scores **0.784**, a small descriptive difference. The full recovery curve and queries to a call target chosen before evaluation would make any savings easier to see alongside that primary score and the 100-query count. All methods must use the same peptide catalogue and public ranks. This is screen-call efficiency, not a binding probability or evidence yet that RL saves queries.

The 16-query view is already at 16 of 16 calls on two development alleles. Using 100 queries gives more room to study feedback, while still examining only about one tenth of one percent of each roughly 96,000-peptide candidate library. These differences across alleles matter: one average score can hide where a method has room to improve.

## From screen replay to an RL episode

The replay environment is now in place; the next learning method has not been selected. In RL terms, one allele-specific screening campaign is an episode. It starts with no revealed calls and a budget of 100 valid peptide queries. The selection rule can inspect the eligible peptide sequences, their R0 counts, and the supplied binding-affinity and eluted-ligand prediction ranks. It cannot inspect unqueried screen calls.

At each step, the action is to choose an eligible, unqueried peptide or stop. A valid choice uses one query and reveals either a positive screen call or “not called.” The environment’s numerical feedback is 1 for a call and 0 otherwise; zero does not mean a measured nonbinder. The observation also tracks which peptides have been queried and how many queries and actions remain. A duplicate or invalid choice uses an action but reveals nothing and does not use a query; an episode has at most 200 actions. A fresh episode clears its query history and within-campaign adaptations. A newly generated peptide outside the recorded library has no replay outcome, so this task cannot score it as a discovery.

<figure class="journal-visual journal-diagram">
  <a href="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-rl-episode.svg">
    <picture>
      <source media="(max-width: 700px)" srcset="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-rl-episode-overview-mobile.svg" width="360" height="1070" />
      <img src="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-rl-episode-overview.svg" width="960" height="600" loading="lazy" decoding="async" alt="Replay flowchart: a policy chooses an unqueried peptide, a valid query reveals a recorded screen call, the campaign state updates, then the policy continues or stops." />
    </picture>
  </a>
  <figcaption>The screen-call table stays hidden until a valid query. The feedback loop uses only earlier charged queries from the same campaign. <a href="/img/journal/2026-10-12-strong-baseline-peptide-screening/m3-rl-episode.svg">Open detailed episode diagram</a>.</figcaption>
</figure>

Here is Python-like pseudocode for two real source-backed queries on the **A\*01:01 training task**. It fixes the first two choices only to show the mechanics; a learned policy would choose its own peptide indices. The helper names are explanatory, rather than a proposed training API.

```python
env = replay_task(allele="A*01:01", panel="r0_1")
catalogue = env.public  # 9-mer, R0 count, BA rank, EL rank
obs, _ = env.reset()     # no calls revealed; 100 queries remain

for peptide in ("TSDGQTLLY", "PTAIYTLEY"):
    action = index_of(peptide, catalogue)  # actions are catalogue indices
    obs, reward, done, truncated, info = env.step(action)
    print(peptide, info["event"]["revealed"]["call_status"],
          reward, obs["remaining_queries"])

# TSDGQTLLY  author_called_positive  1.0  99
# PTAIYTLEY  not_called              0.0  98

while not (done or truncated):
    action = policy.choose(catalogue, obs)  # unqueried index, or stop
    obs, reward, done, truncated, info = env.step(action)
    policy.observe(info["event"], reward)
```

For a future RL method, a training episode would select one of the 12 HLA-A/B allele tasks, reset the campaign, and let the policy choose peptides step by step from that allele’s catalogue. Training could sample or cycle through those tasks, but the allele schedule, algorithm, weight updates, and tuning budget need to be fixed before the next comparison. The four HLA-C tasks are for development evaluation with the learned rule frozen, apart from adaptation within each 100-query campaign. These alleles were chosen after earlier inspection of this dataset; they are not an untouched final test. All 16 tasks share one study and much of one peptide library, and the supplied predictor’s training overlap is unknown.

The next useful test is whether a learner can retain the strong fixed rank and then improve on it using charged feedback: reach the same number of calls in fewer queries, or find more calls within 100. I want a matched version without campaign memory and an adaptive non-RL comparator, so any gain can be attributed more carefully. An independent measured confirmation source would still be needed before claiming broader biological transfer.
