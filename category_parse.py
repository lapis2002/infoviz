import pandas as pd

businesses = pd.read_csv("victoria_data.csv")

d = {}
for cat in businesses.Category:
    if cat in d: d[cat] += 1
    else: d[cat] = 1

categories = []
cnt = []
for k, v in d.items():
    categories.append(k)
    cnt.append(v)


df = pd.DataFrame({
    "Category": categories,
    "Number": cnt
})

df.to_csv("test_catgory.csv", index=False)