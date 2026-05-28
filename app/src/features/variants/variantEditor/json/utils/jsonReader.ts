async function readJSONFromBlob(blob: Blob) {
	try {
		const fileText = await blob.text();
		const parsedJSON = JSON.parse(fileText);

		return parsedJSON;
	} catch (error) {
		console.error("Failed to read JSON from blob", error);
		return null;
	}
}

export { readJSONFromBlob };