get-all-papertrail-logs
=======================

![DOWNLOAD ALL THE LOGS](http://memegen.link/xy/download/all-the-logs.jpg)

Downloads everything in your Papertrail account to cwd or a S3 bucket.

Usage
-----

- Set environment variables: `PAPERTRAIL_TOKEN`, and if you want to send to S3, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

`node fetch` will download things to the cwd.
`node fetch s3 <bucket> <path>` will copy the logs to S3.