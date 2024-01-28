import axios, { AxiosInstance } from "axios";
import { WeaviateCollectionSchema } from "./types";

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

class WeaviateClient {
  private httpClient: AxiosInstance;

  constructor(url: string) {
    this.httpClient = axios.create({
      baseURL: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async httpRequest(
    method: string,
    path: string,
    data?: any
  ): Promise<any> {
    try {
      const response = await this.httpClient.request({
        method: method,
        url: path,
        data: data,
      });
      return response.data;
    } catch (error) {
      const errorDetails = {
        status: error.response.status,
        statusText: error.response.statusText,
        error: error.response.data.error[0].message,
      };
      console.error("Detailed error:", errorDetails);
      throw error.response.data.error;
    }
  }

  public async createClass(className: string): Promise<WeaviateClassSchema> {
    const defaultModuleConfig = {
      "text2vec-openai": {
        model: "text-embedding-3-large",
        modelVersion: "003",
        type: "text",
        vectorizeClassName: true,
      },
    };
    const classData = {
      class: className,
      vectorizer: "text2vec-openai",
      moduleConfig: defaultModuleConfig,
    };

    try {
      const responseData = await this.httpRequest(
        "POST",
        "/v1/schema",
        classData
      );
      return {
        class: responseData.class,
        moduleConfig: responseData.moduleConfig,
        vectorIndexType: responseData.vectorIndexType,
        vectorizer: responseData.vectorizer,
        model: responseData.moduleConfig["text2vec-openai"].model,
      };
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async deleteClass(collectionName: string): Promise<void> {
    try {
      await this.httpRequest("DELETE", `/v1/schema/${collectionName}`);
      console.log(`Collection ${collectionName} deleted successfully`);
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async updateClass(
    collectionName: string,
    schema: WeaviateCollectionUpdateMutable
  ): Promise<void> {
    try {
      await this.httpRequest("PUT", `/v1/schema/${collectionName}`, schema);
      console.log(`Collection ${collectionName} updated successfully`);
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async getClass(
    collectionName?: string
  ): Promise<WeaviateCollectionSchema | WeaviateCollectionSchema[]> {
    try {
      const path = collectionName
        ? `/v1/schema/${collectionName}`
        : "/v1/schema";
      const response = await this.httpRequest("GET", path);
      return response;
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async createObject(
    dataObject: WeaviateDataObject,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "POST",
        `/v1/objects?${params.toString()}`,
        dataObject
      );
      console.log(`Object created successfully in class ${dataObject.class}`);
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async createVector(
    dataObjectWithVector: WeaviateDataObjectWithVector,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "POST",
        `/v1/objects?${params.toString()}`,
        dataObjectWithVector
      );
      console.log(
        `Object with custom vector created successfully in class ${dataObjectWithVector.class}`
      );
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async updateObject(
    className: string,
    objectId: string,
    dataObject: WeaviateDataObject,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "PUT",
        `/v1/objects/${className}/${objectId}?${params.toString()}`,
        dataObject
      );
      console.log(`Object updated successfully in class ${className}`);
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async patchObject(
    className: string,
    objectId: string,
    dataObject: Partial<WeaviateDataObject>,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "PATCH",
        `/v1/objects/${className}/${objectId}?${params.toString()}`,
        dataObject
      );
      console.log(
        `Object partially updated successfully in class ${className}`
      );
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async validateObject(dataObject: WeaviateDataObject): Promise<void> {
    try {
      await this.httpRequest("POST", "/v1/objects/validate", dataObject);
      console.log(`Object validation successful for class ${dataObject.class}`);
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }

  public async addReference(
    className: string,
    objectId: string,
    propertyName: string,
    reference: WeaviateReference,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "POST",
        `/v1/objects/${className}/${objectId}/references/${propertyName}?${params.toString()}`,
        reference
      );
      console.log(
        `Reference added successfully to ${propertyName} in class ${className}`
      );
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async updateReference(
    className: string,
    objectId: string,
    propertyName: string,
    references: WeaviateReference[],
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "PUT",
        `/v1/objects/${className}/${objectId}/references/${propertyName}?${params.toString()}`,
        references
      );
      console.log(
        `References updated successfully for ${propertyName} in class ${className}`
      );
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async deleteReference(
    className: string,
    objectId: string,
    propertyName: string,
    reference: WeaviateReference,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "DELETE",
        `/v1/objects/${className}/${objectId}/references/${propertyName}?${params.toString()}`,
        reference
      );
      console.log(
        `Reference deleted successfully from ${propertyName} in class ${className}`
      );
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }

  
  public async batchCreateObjects(
    objects: WeaviateBatchDataObject[],
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest("POST", `/v1/batch/objects?${params.toString()}`, {
        objects,
      });
      console.log("Batch objects created successfully");
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async batchCreateReferences(
    references: WeaviateBatchReference[],
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }

      await this.httpRequest(
        "POST",
        `/v1/batch/references?${params.toString()}`,
        references
      );
      console.log("Batch references created successfully");
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public async batchDeleteObjects(
    match: WeaviateBatchDeleteMatch,
    output?: "minimal" | "verbose",
    dryRun: boolean = false,
    consistencyLevel?: "ONE" | "QUORUM" | "ALL"
  ): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (consistencyLevel) {
        params.append("consistency_level", consistencyLevel);
      }
      if (output) {
        params.append("output", output);
      }
      if (dryRun) {
        params.append("dryRun", String(dryRun));
      }

      await this.httpRequest(
        "DELETE",
        `/v1/batch/objects?${params.toString()}`,
        { match }
      );
      console.log("Batch objects deleted successfully");
    } catch (error) {
      throw error; // Error details are already handled in httpRequest
    }
  }
  public formatObject(item: any, className: string): WeaviateBatchDataObject {
    if (/^[0-9a-z]/.test(className)) {
      className = "G" + className;
    }
    const properties = typeof item === "string" ? { content: item } : item;
    return {
      class: className,
      properties: properties,
    };
  }
  public async batchObjects(items: any[], className: string): Promise<boolean> {
    const weaviateObjects = items.map((item) =>
      this.formatObject(item, className)
    );
    try {
      const response = await this.httpClient.post("/batch/objects", {
        objects: weaviateObjects,
      });
      const batchResponse = response.data;
      const errors = batchResponse.filter(
        (x) => x.result?.errors?.error !== undefined
      );
      const vectorizedCount = batchResponse.length - errors.length;

      console.log("Number of vectorized objects:", vectorizedCount);
      console.log("Number of errors:", errors.length);
      if (errors.length > 0) {
        console.log("Last error:", errors[errors.length - 1]);
      }

      return true;
    } catch (error) {
      console.error("Error in batchObjects:", error);
      return false;
    }
  }
  public async storeInBatch<T extends object | string>(
    items: T[],
    className: string
  ): Promise<void> {
    const BATCH_SIZE = 2900;
    const RATE_LIMIT_DELAY = 60000; // 1 minute

    const batches = [];
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      batches.push(items.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1} of ${batches.length}.`);
      await this.batchObjects(batches[i], className);

      if (i < batches.length - 1) {
        console.log("Waiting for rate limit delay before next batch...");
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }
    console.log("All batches processed.");
  }
  public buildQuery(
    searchQuery: string,
    className: string,
    fields: string[]
  ): string {
    const query = JSON.stringify(searchQuery);
    const fieldsQuery = fields.join("\n");

    return `{
            Get {
                ${className} (nearText: {
                    concepts: [${query}],
                    distance: 0.9
                },
                limit: 20) {
                    ${fieldsQuery}
                }
            }
        }`;
  }
  public Query(
    searchQuery: string,
    className: string,
    fields: string[]
  ): string {
    return this.buildQuery(searchQuery, className, fields);
  }
  public async search(
    searchQuery: string,
    className: string,
    fields: string[]
  ): Promise<any[]> {
    try {
      const query = this.Query(searchQuery, className, fields);
      const response = await this.httpClient.post("/graphql", { query });
      return response.data.data.Get[className];
    } catch (error) {
      console.error("Error fetching index:", error);
      return [];
    }
  }
}
