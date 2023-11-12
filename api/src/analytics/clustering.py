from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import json
import pickle

def build_clustering_model(file_name, df, df_pca, cluster_number):
    silhouette_scores = []
    range_n_clusters = list(range(2, 9))
    max_silhouette_score = -1
    cluster_no = cluster_number
    if cluster_number == 0:
        for n_clusters in range_n_clusters:
            clusterer = KMeans(n_clusters=n_clusters, random_state=10)
            cluster_labels = clusterer.fit_predict(df_pca)
            silhouette_avg = silhouette_score(df_pca, cluster_labels)
            silhouette_scores.append(silhouette_avg)
            if silhouette_avg > max_silhouette_score:
                max_silhouette_score = silhouette_avg
                cluster_no = n_clusters

    best_model = KMeans(n_clusters=cluster_no, random_state=10)
    cluster_labels = best_model.fit_predict(df_pca)

    df_pca['Cluster'] = cluster_labels
    df['Cluster'] = cluster_labels

    # save to file
    df.to_csv(f"./{file_name}_clustered.csv", index=False)
    pickle.dump(best_model, open(f'./{file_name}_best_model.pickle', 'wb'))

    return {
        "silhouette": {
            "range": range_n_clusters,
            "scores": silhouette_scores,
            "best": max_silhouette_score,
            "cluster_no": cluster_no
        },
        "clustered": json.loads(json.dumps(df_pca.to_dict('records')))
    }
