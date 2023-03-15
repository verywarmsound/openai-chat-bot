import pandas as pd

df = pd.read_json('file2.json')

df.to_json("json_lines.jl", orient="records", lines=True)
