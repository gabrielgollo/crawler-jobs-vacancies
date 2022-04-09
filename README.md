# Crawler-job-vacancies

## Description

This project will be a simple cron that will run multiples crawlers to webscrapper enterprise websites and get new jobs.

This will be integrated with others projects by using RabbitMQ

---

## Architecture

![](https://i.imgur.com/kSxS4kJ_d.webp?maxwidth=760&fidelity=grand)

Based in this diagram, it'll be integrated with other project that consumes the same queue and should have a logic to emit a message to a notify project.