/**
 * Represents a collection configuration in Weaviate.
 */
interface WeaviateCollection {
    /**
     * The name of the collection.
     */
    class: string;
  
    /**
     * Configuration for the inverted index of the collection.
     */
    invertedIndexConfig: InvertedIndexConfig;
  
    /**
     * Module-specific configuration.
     */
    moduleConfig: ModuleConfig;
  
    /**
     * Configuration for enabling multi-tenancy for the collection.
     */
    multiTenancyConfig: MultiTenancyConfig;
  
    /**
     * Array of properties for the collection. Can be null if no properties are defined.
     */
    properties: Property[] | null;
  
    /**
     * Configuration for data replication in the collection.
     */
    replicationConfig: ReplicationConfig;
  
    /**
     * Configuration for sharding in a multi-node environment.
     */
    shardingConfig: ShardingConfig;
  
    /**
     * Configuration for the vector index of the collection.
     */
    vectorIndexConfig: VectorIndexConfig;
  
    /**
     * The type of vector index used in the collection.
     */
    vectorIndexType: string;
  
    /**
     * The vectorizer module used for the collection.
     */
    vectorizer: string;
  }
  
  /**
   * Configuration for the inverted index of a collection.
   */
  interface InvertedIndexConfig {
    /**
     * Configuration for BM25 ranking in the inverted index.
     */
    bm25: BM25Config;
  
    /**
     * Cleanup interval in seconds for the inverted index.
     */
    cleanupIntervalSeconds: number;
  
    /**
     * Configuration for stopwords in the inverted index.
     */
    stopwords: StopwordsConfig;
  }
  
  /**
   * BM25 ranking configuration.
   */
  interface BM25Config {
    b: number;
    k1: number;
  }
  
  /**
   * Configuration for stopwords.
   */
  interface StopwordsConfig {
    additions: string[] | null;
    preset: string;
    removals: string[] | null;
  }
  
  /**
   * Module-specific configuration.
   */
  interface ModuleConfig {
    /**
     * Configuration for the 'text2vec-openai' module.
     */
    "text2vec-openai": Text2VecOpenAIConfig;
  }
  
  /**
   * Configuration for the 'text2vec-openai' module.
   */
  interface Text2VecOpenAIConfig {
    baseURL: string;
    model: string;
    modelVersion: string;
    type: string;
    vectorizeClassName: boolean;
  }
  
  /**
   * Configuration for multi-tenancy.
   */
  interface MultiTenancyConfig {
    enabled: boolean;
  }
  
  /**
   * Represents a property in a collection.
   */
  interface Property {
    // Define the structure and descriptions of a property based on your requirements
  }
  
  /**
   * Configuration for data replication.
   */
  interface ReplicationConfig {
    factor: number;
  }
  
  /**
   * Configuration for sharding in a multi-node environment.
   */
  interface ShardingConfig {
    virtualPerPhysical: number;
    desiredCount: number;
    actualCount: number;
    desiredVirtualCount: number;
    actualVirtualCount: number;
    key: string;
    strategy: string;
    function: string;
  }
  
  /**
   * Configuration for the vector index of a collection.
   */
  interface VectorIndexConfig {
    skip: boolean;
    cleanupIntervalSeconds: number;
    maxConnections: number;
    efConstruction: number;
    ef: number;
    dynamicEfMin: number;
    dynamicEfMax: number;
    dynamicEfFactor: number;
    vectorCacheMaxObjects: number;
    flatSearchCutoff: number;
    distance: string;
    pq: PQConfig;
  }
  
  /**
   * Configuration for Product Quantization (PQ) in vector index.
   */
  interface PQConfig {
    enabled: boolean;
    bitCompression: boolean;
    segments: number;
    centroids: number;
    trainingLimit: number;
    encoder: any; // Replace 'any' with a more specific type if available
  }
  
  // You can further define or modify these interfaces based on the specific needs of your application.
  

  interface WeaviateClassSchema {
    class: string;
    moduleConfig: {
      "text2vec-openai": {
        baseURL?: string;
        model: string;
        modelVersion: string;
        type: string;
        vectorizeClassName: boolean;
      };
    };
    model: string;
    vectorIndexType: string;
    vectorizer: string;
  }
  
  interface WeaviateDataObject {
    class: string;
    properties: any; // Define specific types for properties based on your schema
    id?: string;
    tenant?: string;
  }
  
  interface WeaviateDataObjectWithVector extends WeaviateDataObject {
    vector: number[];
  }
  
  interface WeaviateBatchDataObject {
    class: string;
    id?: string;
    properties: any;
    tenant?: string;
  }
  
  interface WeaviateBatchReference {
    from: string; // Beacon with property name, e.g., "weaviate://localhost/Author/ObjectID/propertyName"
    to: string; // Beacon to the target object, e.g., "weaviate://localhost/TargetClass/ObjectID"
  }
  
  interface WeaviateBatchDeleteMatch {
    class: string;
    where: any; // Define the where filter object as per Weaviate's filter requirements
  }
  /**
   * Not all settings are mutable
   * Please note that not all settings are mutable.
   * To update any other (i.e. immutable) setting, you need to delete the collection, re-create it with the correct setting and then re-import the data.
   */
  interface WeaviateCollectionUpdateMutable {
    class: string;
    description?: string;
    vectorIndexConfig?: object;
    invertedIndexConfig?: {
      bm25?: {
        b?: number;
        k1?: number;
      };
      stopwords?: object;
    };
    replicationConfig?: {
      factor?: number;
    };
  }
  
  interface WeaviateReference {
    beacon: string; // Beacon in the format "weaviate://localhost/ClassName/ObjectID"
  }
  
