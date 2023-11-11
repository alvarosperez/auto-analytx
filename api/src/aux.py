import pandas as pd
import numpy as np
import csv

def identify_header(path, n=5, th=0.9, sep=','):
    df1 = pd.read_csv(path, header='infer', nrows=n, sep=sep)
    df2 = pd.read_csv(path, header=None, nrows=n, sep=sep)
    sim = (df1.dtypes.values == df2.dtypes.values).mean()
    return True if sim < th else False

def detect_separator(file_path):
    separator = ','
    with open(file_path) as csvfile:
        sniffer = csv.Sniffer()
        first_row = sniffer.sniff(csvfile.readline())
        separator = first_row.delimiter
    return separator

def bin(new_df, col, bin_num, min_max_mean):
    [min, max, mean] = min_max_mean
    bin_size = (max - mean) / bin_num
    bins = np.arange(min, max, bin_size)
    new_df['binned'] = pd.cut(new_df[col], bins)

    bins = new_df.groupby(pd.cut(new_df[col], bins=bins)).size()

    return { str(x).replace('(', '['): y for x, y in bins.to_dict().items() }
