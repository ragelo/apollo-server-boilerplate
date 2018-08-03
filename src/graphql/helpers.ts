type NodeName = 'User' | 'Viewer';

export function toGlobalId(nodeName: NodeName, id: string | number): string {
  return Buffer.from(`${nodeName}:${id}`).toString('base64');
}

export function fromGlobalId(globalId: string, nodeNamesToCheck: string[] | string): [number | string, string] {
  const encodedStr = Buffer.from(globalId, 'base64').toString('ascii');
  const [nodeName, idString] = encodedStr.split(':');

  const id = !isNaN(Number(idString)) ? Number(idString) : idString;

  if (nodeNamesToCheck) {
    if (typeof nodeNamesToCheck === 'string') {
      nodeNamesToCheck = [nodeNamesToCheck]
    }

    if (nodeNamesToCheck.indexOf(nodeName) < 0) {
      throw new Error(`Invalid id. Expected: ${nodeNamesToCheck}, found: ${nodeName}`);
    }
  }

  return [id, nodeName];
}

