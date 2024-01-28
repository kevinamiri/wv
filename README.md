##  1: Instantiate the WeaviateClient

```javascript
// Instantiate the WeaviateClient
const client = new WeaviateClient('http://localhost:8080');
```

- This code creates an instance of the WeaviateClient, pointing to a Weaviate server running locally at `http://localhost:8080`.

##  2: Create a Class

```javascript
// Create a class
client.createClass('Article')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

- Use this code to create a new class named 'Article' in your Weaviate schema.

##  3: Delete a Class

```javascript
// Delete a class
client.deleteClass('Article')
  .then(() => console.log('Class deleted successfully'))
  .catch(error => console.error(error));
```

- This code deletes the 'Article' class that was previously created.

##  4: Update a Class

```javascript
// Update a class
const schema = {
  class: 'Article',
  description: 'Updated description',
};
client.updateClass('Article', schema)
  .then(() => console.log('Class updated successfully'))
  .catch(error => console.error(error));
```

- Use this code to update the 'Article' class with a new description.

##  5: Get a Class

```javascript
// Get a class
client.getClass('Article')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

- This code retrieves information about the 'Article' class from the Weaviate server.

##  6: Create an Object

```javascript
// Create an object
const dataObject = {
  class: 'Article',
  properties: {
    title: 'New Article',
    content: 'This is a new article.',
  },
};
client.createObject(dataObject)
  .then(() => console.log('Object created successfully'))
  .catch(error => console.error(error));
```

- This code creates a new object of the 'Article' class with specified properties.

##  7: Create a Vector

```javascript
// Create a vector
const dataObjectWithVector = {
  class: 'Article',
  properties: {
    title: 'New Article',
    content: 'This is a new article.',
  },
  vector: [0.1, 0.2, 0.3, 0.4],
};
client.createVector(dataObjectWithVector)
  .then(() => console.log('Vector created successfully'))
  .catch(error => console.error(error));
```

- Use this code to create an object of the 'Article' class with a specified vector.

##  8: Update an Object

```javascript
// Update an object
const updatedDataObject = {
  class: 'Article',
  properties: {
    title: 'Updated Article',
    content: 'This is an updated article.',
  },
};
client.updateObject('Article', 'objectId', updatedDataObject)
  .then(() => console.log('Object updated successfully'))
  .catch(error => console.error(error));
```

- This code updates an existing 'Article' object with new properties.

##  9: Patch an Object

```javascript
// Patch an object
const patchedDataObject = {
  properties: {
    title: 'Patched Article',
  },
};
client.patchObject('Article', 'objectId', patchedDataObject)
  .then(() => console.log('Object patched successfully'))
  .catch(error => console.error(error));
```

- Use this code to patch an existing 'Article' object with new property values.

##  10: Validate an Object

```javascript
// Validate an object
client.validateObject(dataObject)
  .then(() => console.log('Object validated successfully'))
  .catch(error => console.error(error));
```

- This code validates the 'dataObject' against the schema to ensure it meets the class's requirements.

##  11: Add a Reference

```javascript
// Add a reference
const reference = {
  beacon: 'weaviate://localhost/Article/objectId',
};
client.addReference('Article', 'objectId', 'relatedArticles', reference)
  .then(() => console.log('Reference added successfully'))
  .catch(error => console.error(error));
```

- Use this code to add a reference from an object to another object ('relatedArticles').

##  12: Update a Reference

```javascript
// Update a reference
const references = [
  {
    beacon: 'weaviate://localhost/Article/objectId1',
  },
  {
    beacon: 'weaviate://localhost/Article/objectId2',
  },
];
client.updateReference('Article', 'objectId', 'relatedArticles', references)
  .then(() => console.log('References updated successfully'))
  .catch(error => console.error(error));
```

- This code updates the references from an object to other objects ('relatedArticles').

##  13: Delete a Reference

```javascript
// Delete a reference
client.deleteReference('Article', 'objectId', 'relatedArticles', reference)
  .then(() => console.log('Reference deleted successfully'))
  .catch(error => console.error(error));
```

- Use this code to delete a reference from an object to another object ('relatedArticles').

##  14: Batch Create Objects

```javascript
// Batch create objects
const objects = [
  {
    class: 'Article',
    properties: {
      title: 'Batch Article 1',
      content: 'This is a batch article.',
    },
  },
  {
    class: 'Article',
    properties: {
      title: 'Batch Article 2',
      content: 'This is another batch article.',
    },
  },
];
client.batchCreateObjects(objects)
  .then(() => console.log('Batch objects created successfully'))
  .catch(error => console.error(error));
```

- This code creates multiple objects of the 'Article' class in a batch operation.

##  15: Batch Create References

```javascript
// Batch create references
const batchReferences = [
  {
    from: 'weaviate://localhost/Article/objectId',
    to: 'weaviate://localhost/Article/objectId1',
  },
  {
    from: 'weaviate://localhost/Article/objectId',
    to: 'weaviate://localhost/Article/objectId2',
  },
];
client.batchCreateReferences(batchReferences)
  .then(() => console.log('Batch references created successfully'))
  .catch(error => console.error(error));
```

- Use this code to create multiple references between objects in a batch operation.

##  16: Batch Delete Objects

```javascript
// Batch delete objects
const match = {
  class: 'Article',
  where: {
    operator: 'Equal',
    valueString: 'Batch Article 1',
    path: ['title'],
  },
};
client.batchDeleteObjects(match)
  .then(() => console.log('Batch objects deleted successfully'))
  .catch(error =>

 console.error(error));
```

- This code deletes multiple objects of the 'Article' class that match a specified condition in a batch operation.
