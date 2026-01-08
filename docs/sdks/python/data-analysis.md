---
title: "Python Data Analysis"
category: "SDKs"
---

# Python SDK for Data Scientists

The Python SDK is optimized for integration with Pandas and NumPy.

## Installation

```bash
pip install bmdrm-py
```

## Fetching Dataframes

You can fetch historical data directly as a Pandas DataFrame.

```python
import bmdrm
import pandas as pd

client = bmdrm.Client(api_key="sk_test_555")

# Fetch last 30 days of user activity
df = client.query(
    "SELECT * FROM user_events WHERE timestamp > NOW() - INTERVAL '30 days'"
).to_pandas()

print(df.describe())
```

## Batch Processing

```python
def process_batch(record):
    record['processed'] = True
    return record

# Process 1M records efficiently
with client.batch_processor('events', batch_size=1000) as processor:
    for record in source_data:
        processor.add(process_batch(record))
```
