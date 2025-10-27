// --- INÍCIO DA MÁQUINA DA TABUADA ---

/**
 * Gera uma lista de todas as operações da tabuada de 1 a 10.
 * @returns {string[]} Um array de strings (ex: "1 × 1", "1 × 2", ...)
 */
function generateTimesTableOperations() {
    const operations = [];
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            // Usamos o caractere de multiplicação '×' em vez de 'x'
            operations.push(`${i} × ${j}`);
        }
    }
    return operations;
}

/**
 * Embaralha um array aleatoriamente (algoritmo Fisher-Yates).
 * @param {Array} array - O array a ser embaralhado.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- FIM DA MÁQUINA DA TABUADA ---


// --- LÓGICA PRINCIPAL DA CARTELA ---

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    // Referência ao 'selectAllBtn' removida
    const bingoOverlay = document.getElementById('bingoOverlay');
    const resetBtn = document.getElementById('resetBtn');
    
    const cells = []; // Array para armazenar apenas as células clicáveis
    const totalCells = 25;
    const freeSpaceIndex = 13; // O número da célula central (1 a 25)

    // 1. Prepara os números da tabuada
    let timesTableOperations = generateTimesTableOperations();
    shuffleArray(timesTableOperations);

    // 2. Cria as células da grade
    for (let i = 1; i <= totalCells; i++) {
        const cell = document.createElement('div');
        // Bordas mais claras para o fundo branco (gray-300)
        cell.className = 'cell w-full h-full border-2 border-gray-300 rounded-lg flex items-center justify-center text-sm md:text-lg font-semibold cursor-pointer transition-all duration-200 shadow-md';

        if (i === freeSpaceIndex) {
            // É o espaço livre central
            cell.classList.add('free-space');
            cell.classList.remove('cursor-pointer'); // Não é clicável
            // Ícone de estrela SVG
            cell.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.116 3.552.97 5.39c.192 1.06-.976 1.89-1.926 1.38l-4.715-2.675-4.716 2.675c-.95.51-2.118-.32-1.926-1.38l.97-5.39-4.116-3.552c-.887-.76-.415-2.212.749-2.305l5.404-.433L10.788 3.21z" clip-rule="evenodd" />
                </svg>
            `;
        } else {
            // Células normais com números
            cell.textContent = timesTableOperations.pop() || 'N/A';
            
            // Adiciona o evento de clique
            cell.addEventListener('click', () => {
                cell.classList.toggle('selected');
                checkBingo();
            });
            
            // Adiciona a célula ao nosso array de controle
            cells.push(cell);
        }
        
        gridContainer.appendChild(cell);
    }

    // --- Funções Auxiliares ---

    function checkBingo() {
        // Verifica se TODAS as células no array 'cells' (as 24 clicáveis)
        // têm a classe 'selected'.
        const allSelected = cells.every(c => c.classList.contains('selected'));
        
        if (allSelected) {
            showBingo();
        }
    }

    function showBingo() {
        bingoOverlay.classList.remove('hidden');
        bingoOverlay.classList.add('flex');
    }

    function hideBingo() {
        bingoOverlay.classList.add('hidden');
        bingoOverlay.classList.remove('flex');
    }
    
    // --- Eventos dos Botões ---

    // Evento do 'selectAllBtn' foi removido

    // Adiciona o evento ao botão "Voltar" da tela de Bingo
    resetBtn.addEventListener('click', () => {
        hideBingo();
    });
});