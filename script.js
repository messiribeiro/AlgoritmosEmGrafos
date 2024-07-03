document.addEventListener('DOMContentLoaded', () => {
  const adjacencyMatrix = [
    [0, 2, 0, 1, 0], // Conexões do Nó 1
    [2, 0, 3, 4, 0], // Conexões do Nó 2
    [0, 3, 0, 5, 0], // Conexões do Nó 3
    [1, 4, 5, 0, 6], // Conexões do Nó 4
    [0, 0, 0, 6, 0]  // Conexões do Nó 5
  ];

  // Gerando os nós
  const nodes = [];
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    nodes.push({ id: i, label: 'Nó ' + (i + 1) });
  }

  // Gerando as arestas com rótulos (pesos)
  const edges = [];
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    for (let j = i + 1; j < adjacencyMatrix[i].length; j++) {
      if (adjacencyMatrix[i][j] > 0) {
        edges.push({ from: i, to: j, label: adjacencyMatrix[i][j].toString() });
      }
    }
  }

  // Criando o grafo
  const container = document.getElementById('mynetwork');
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };
  const options = {};
  const network = new vis.Network(container, data, options);
});
