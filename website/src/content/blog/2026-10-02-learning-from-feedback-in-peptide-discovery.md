---
title: Can learning from feedback improve peptide discovery?
description: A first research note on sequential decisions, peptide–MHC binding, and what it will take to evaluate learning from feedback.
date: 2026-10-02
author: Peter Shen
tags: [research, peptide-discovery]
published: true
---

When you have a long list of biological candidates, how do you decide what to try next? You could rank them with a prediction model and start at the top. But after evaluating a few candidates, you have something you did not have at the beginning: feedback. Should that change your next choice?

This is the question I want to explore through Next Motion AI. I’m starting with a small computational research project in peptide–MHC binding, with reinforcement learning as one approach to making those sequential decisions.

The research question is:

> Can learning from feedback make computational peptide discovery more effective?

## A focused starting point

A little biology helps make this concrete. Peptides are short chains of amino acids. MHC proteins bind some of these fragments as part of the process through which the immune system encounters them. Understanding which peptides bind is one piece of a much larger biological problem.

Reinforcement learning interests me because it treats a sequence of choices and their consequences as a learning problem. I want to investigate whether that perspective is useful here, and under what conditions.

## What computation can tell us

I’m starting in silico, using computation to explore the question. That gives the project a manageable starting point, with clear limits on what we can conclude. A computational prediction is not an experimental measurement. And binding alone does not establish that a peptide will be presented on a cell, trigger a T-cell response, or become an effective treatment.

## How I’ll judge progress

The first challenge is to build a useful way to evaluate progress. I want comparisons with simpler approaches, clear accounting of resources, and experiments that can be reproduced. If a more complicated method does not help, that is useful to learn too.

Right now, the software foundation is set up, and the research environment still needs to be built. There are no experimental results to report yet. I’ll use this journal to share what we learn as the work develops, including the decisions that need revisiting. If you work at the intersection of machine learning and biology, I’d be interested in what would make this question useful to you.
