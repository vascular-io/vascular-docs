# Streaming analytics events to S3

The Vascular platform supports streaming of analytics events to **Amazon S3** using **Amazon Kinesis Data Firehose**. This allows persistent storage of user event logs for auditing, analytics, and integration with analytical tools.

Four types of events are tracked and streamed:

- Delivered
- Read
- Opened
- Deleted

Each event type is streamed to a dedicated S3 bucket.

## Required S3 buckets

You must create the S3 bucket `vascular-inbox-events`.

> Ensure the bucket has the correct write permissions and optional lifecycle policies (e.g., auto-expiration) as needed.

## IAM role for Firehose

Create a single IAM role named:

```
firehose-to-s3-writer
```

This role grants Kinesis Firehose permission to write to the S3 buckets.

### Trust relationship policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "firehose.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Permissions policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:PutObjectAcl"],
      "Resource": [
        "arn:aws:s3:::vascular-inbox-events/*"
      ]
    }
  ]
}
```

## Create Firehose delivery streams

Create a Firehose delivery stream `message-interaction-events`.

Use the IAM role `firehose-to-s3-writer` on the stream to grant write permissions to the target S3 bucket.

## Example: message-interaction-events configuration

The following is a sample JSON configuration for `message-interaction-events`. It defines how Firehose writes analytics events to the S3 bucket:

```json
{
  "DeliveryStreamName": "message-interaction-events",
  "DeliveryStreamType": "DirectPut",
  "S3DestinationConfiguration": {
    "RoleARN": "arn:aws:iam::000000000000:role/firehose-to-s3-writer",
    "BucketARN": "arn:aws:s3:::vascular-inbox-events",
    "Prefix": "vascular",
    "ErrorOutputPrefix": "test-error-log",
    "BufferingHints": {
      "SizeInMBs": 1,
      "IntervalInSeconds": 60
    },
    "CompressionFormat": "UNCOMPRESSED",
    "CloudWatchLoggingOptions": {
      "Enabled": false,
      "LogGroupName": "",
      "LogStreamName": ""
    }
  },
  "Tags": [
    {
      "Key": "Environment",
      "Value": "Production"
    }
  ]
}
```

## Notes

- **S3 prefix**: Files will be written to S3 under the prefix `myorg-log/YYYY/MM/DD/HH/`, based on the time the data was delivered.
- **Buffering**: Records are flushed to S3 when either 1 MB of data is accumulated or 60 seconds have passed.
- **Compression**: By default, data is stored uncompressed. You can change the compression format to `GZIP` or `Snappy` if needed.
- **Error output prefix**: If delivery to S3 fails, failed records are written to the `error-log/` prefix for inspection.
- **CloudWatch logging**: Logging is disabled in the example config. Enable it by setting `Enabled: true` and providing a log group and stream if needed.
- **Region alignment**: Make sure the environment variable `AWS_REGION` is set in your application. The S3 buckets and Firehose delivery streams should be created in the same AWS region to avoid latency, cross-region data transfer costs, and potential access issues.
