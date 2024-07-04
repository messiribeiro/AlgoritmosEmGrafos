const droparea = document.querySelector('.drag-and-drop');
const svg = document.querySelector('.upload-svg');
// Parte do código que lida com o drop de arquivos
const active = () => {
  svg.classList.add("svg-animation-on")
  droparea.classList.add("active")
}

const inactive = () => {
  svg.classList.remove("svg-animation-on")
  droparea.classList.remove("active")
}

const prevents = (e) => e.preventDefault();

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
  droparea.addEventListener(evtName, prevents);
});

['dragenter', 'dragover'].forEach(evtName => {
  droparea.addEventListener(evtName, active);
});

['dragleave', 'drop'].forEach(evtName => {
  droparea.addEventListener(evtName, inactive);
});

droparea.addEventListener("drop", (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  for (let i = 0; i < files.length; i++) {
    matrixCreate(files[i]); // Passa cada arquivo individualmente para matrizCreate
  }
});


function kruskal(adjMatrix) {
  const n = adjMatrix.length;
  const edges = [];

  // Constrói uma lista de arestas a partir da matriz de adjacência
  for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
          if (adjMatrix[i][j] !== 0) {
              edges.push([i, j, adjMatrix[i][j]]);
          }
      }
  }

  // Ordena as arestas pelo peso
  edges.sort((a, b) => a[2] - b[2]);

  // Inicializa a estrutura Union-Find
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);

  function find(x) {
      if (parent[x] !== x) {
          parent[x] = find(parent[x]);
      }
      return parent[x];
  }

  function union(x, y) {
      const rootX = find(x);
      const rootY = find(y);
      if (rootX !== rootY) {
          if (rank[rootX] > rank[rootY]) {
              parent[rootY] = rootX;
          } else if (rank[rootX] < rank[rootY]) {
              parent[rootX] = rootY;
          } else {
              parent[rootY] = rootX;
              rank[rootX]++;
          }
      }
  }

  const newMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  let edgeCount = 0;

  // Aplica o algoritmo de Kruskal
  for (const [u, v, weight] of edges) {
      if (find(u) !== find(v)) {
          union(u, v);
          newMatrix[u][v] = weight;
          newMatrix[v][u] = weight;
          edgeCount++;
          if (edgeCount === n - 1) break; // Termina quando a MST tem n-1 arestas
      }
  }

  return newMatrix;
}

function prim(adjMatrix) {
  const n = adjMatrix.length;
  const selected = Array(n).fill(false);
  const newMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  const minEdge = Array(n).fill(Infinity);
  const parent = Array(n).fill(-1);

  minEdge[0] = 0;

  for (let i = 0; i < n - 1; i++) {
      let u = -1;

      for (let v = 0; v < n; v++) {
          if (!selected[v] && (u === -1 || minEdge[v] < minEdge[u])) {
              u = v;
          }
      }

      selected[u] = true;

      for (let v = 0; v < n; v++) {
          if (adjMatrix[u][v] !== 0 && !selected[v] && adjMatrix[u][v] < minEdge[v]) {
              minEdge[v] = adjMatrix[u][v];
              parent[v] = u;
          }
      }
  }

  for (let v = 1; v < n; v++) {
      const u = parent[v];
      newMatrix[u][v] = adjMatrix[u][v];
      newMatrix[v][u] = adjMatrix[u][v];
  }

  return newMatrix;
}


function matrixCreate(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target.result;
    const matrices = content.split('\n\n'); // Separa as matrizes com base em dois novos caracteres de linha

    matrices.forEach((matrixText, index) => {
      const matrixLines = matrixText.trim().split('\n');
      const adjMatrix = [];

      matrixLines.forEach(line => {
        const row = line.trim().split(' ').map(Number);
        adjMatrix.push(row);
      });


      renderGraph(adjMatrix);
      renderKruskal(kruskal(adjMatrix));
      renderPrim(prim(adjMatrix));
      console.log(prim(adjMatrix))
      showResult()

    });
  };

  reader.readAsText(file);
}


//gerar um grafo aleatório

document.querySelector(".random").addEventListener("click", () => {
  const adjMatrix = generateRandomAdjMatrix(4, 8);
  console.log(adjMatrix);

  renderGraph(adjMatrix, '.renderGraph');
  renderGraph(kruskal(adjMatrix), '.renderKruskal');
  renderGraph(prim(adjMatrix), '.renderPrim');
  showResult();
});


// Função para renderizar o grafo usando vis.js
function renderGraph(adjacencyMatrix, containerSelector) {
  const container = document.querySelector(containerSelector);
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();

  for (let i = 0; i < adjacencyMatrix.length; i++) {
      nodes.add({ id: i + 1, label: `v${i + 1}` });
  }

  for (let i = 0; i < adjacencyMatrix.length; i++) {
      for (let j = i + 1; j < adjacencyMatrix.length; j++) {
          if (adjacencyMatrix[i][j] !== 0) {
              edges.add({
                  from: i + 1,
                  to: j + 1,
                  label: String(adjacencyMatrix[i][j])
              });
          }
      }
  }

  const data = { nodes, edges };
  const options = {
      layout: { randomSeed: 2 },
      physics: { enabled: false },
      edges: { smooth: false }
  };

  new vis.Network(container, data, options);
}

function renderKruskal(adjacencyMatrix) {
  // Criando um grafo vazio (usando a biblioteca vis.js)
  const container = document.querySelector('.renderKruskal');
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();

  // Adicionando vértices ao grafo
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    nodes.add({ id: i + 1 , label: `v${i+1}`,});
  }

  // Adicionando arestas com pesos
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    for (let j = i + 1; j < adjacencyMatrix.length; j++) {
      if (adjacencyMatrix[i][j] !== 0) {
        edges.add({
          from: i + 1,
          to: j + 1,
          label: String(adjacencyMatrix[i][j])
        });
      }
    }
  }

  // Configurações do grafo
  const data = {
    nodes: nodes,
    edges: edges
  };
  const options = {
    layout: {
      randomSeed: 2, 
    },
    physics: {
      enabled: false 
    },
      edges: {
        smooth: false,
      }
  };
  

  // Renderizando o grafo
  const network = new vis.Network(container, data, options);
}

function renderPrim(adjacencyMatrix) {
  // Criando um grafo vazio (usando a biblioteca vis.js)
  const container = document.querySelector('.renderPrim');
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();

  // Adicionando vértices ao grafo
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    nodes.add({ id: i + 1 , label: `v${i+1}`,});
  }

  // Adicionando arestas com pesos
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    for (let j = i + 1; j < adjacencyMatrix.length; j++) {
      if (adjacencyMatrix[i][j] !== 0) {
        edges.add({
          from: i + 1,
          to: j + 1,
          label: String(adjacencyMatrix[i][j])
        });
      }
    }
  }

  // Configurações do grafo
  const data = {
    nodes: nodes,
    edges: edges
  };
  const options = {
    layout: {
      randomSeed: 2, // Semente aleatória para layout estático
    },
    physics: {
      enabled: false // Desabilita a física para posicionar nós manualmente
    },
    edges: {
      smooth: false
    }
  };
  

  // Renderizando o grafo
  const network = new vis.Network(container, data, options);
}


const resultSection = document.querySelector('.result');
const generateSection = document.querySelector('.generate');

//essa função altera entre as sections
function showResult() {
  
  resultSection.classList.remove('display-none');
  generateSection.classList.add('display-none');

}


const newGraph = document.querySelector(".newGraph");


newGraph.addEventListener("click", ()=> {
  resultSection.classList.add('display-none');
  generateSection.classList.remove('display-none');
})


//gerar matriz aleatoriamente
function generateRandomAdjMatrix(minVertices, maxVertices) {
  const n = Math.floor(Math.random() * (maxVertices - minVertices + 1)) + minVertices;
  const adjMatrix = Array.from({ length: n }, () => Array(n).fill(0));
  let edgeCount = 0;

  for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
          if (Math.random() < 0.5) { // 50% chance de haver uma aresta entre i e j
              const weight = Math.floor(Math.random() * 10) + 1; // Pesos entre 1 e 10
              adjMatrix[i][j] = weight;
              adjMatrix[j][i] = weight;
              edgeCount++;
          }
      }
  }

  // Garantir que há pelo menos n-1 arestas
  while (edgeCount < n - 1) {
      const i = Math.floor(Math.random() * n);
      let j;
      do {
          j = Math.floor(Math.random() * n);
      } while (i === j || adjMatrix[i][j] !== 0);

      const weight = Math.floor(Math.random() * 10) + 1; // Pesos entre 1 e 10
      adjMatrix[i][j] = weight;
      adjMatrix[j][i] = weight;
      edgeCount++;
  }

  return adjMatrix;
}