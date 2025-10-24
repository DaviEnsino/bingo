document.addEventListener('DOMContentLoaded', () => {
            // --- Referências aos Elementos do HTML ---
            const display = document.getElementById('currentNumberDisplay');
            const drawButton = document.getElementById('drawButton');
            const resetButton = document.getElementById('resetButton');
            const historyGrid = document.getElementById('historyGrid');
            
            // Novos elementos do Modal
            const showOperationsButton = document.getElementById('showOperationsButton');
            const operationsModal = document.getElementById('operationsModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalList = document.getElementById('modalList');
            const closeModalButton = document.getElementById('closeModalButton');

            // --- Variáveis de Estado ---
            let allNumbers = [];
            let availableNumbers = [];
            let drawnNumbersHistory = []; // Armazena TODOS os números sorteados
            // O 'Mapa' que armazena as operações para cada número
            let operationsMap = new Map();


            // --- Funções Principais ---

            /**
             * Gera os dados:
             * 1. Um Set com os resultados únicos.
             * 2. Um Map que liga cada resultado a um array de operações.
             */
            function generateData() {
                const results = new Set();
                operationsMap.clear(); // Limpa o mapa para reinícios

                for (let i = 1; i <= 10; i++) {
                    for (let j = 1; j <= 10; j++) {
                        const result = i * j;
                        const operation = `${i} × ${j}`;
                        results.add(result);

                        // Se o mapa ainda não tem esse número, cria um array para ele
                        if (!operationsMap.has(result)) {
                            operationsMap.set(result, []);
                        }
                        // Adiciona a operação ao array daquele número
                        operationsMap.get(result).push(operation);
                    }
                }
                // Retorna os resultados únicos
                return results;
            }

            /**
             * Inicializa o sorteador, criando a lista de números e a grade de histórico.
             */
            function initialize() {
                // Gera os números únicos E o mapa de operações
                allNumbers = Array.from(generateData()).sort((a, b) => a - b);
                
                // Preenche a grade de histórico
                populateHistoryGrid();
                
                // Reseta o estado do sorteio
                resetSorteio();
            }
            
            /**
             * Preenche a grade de histórico com todos os números únicos.
             */
            function populateHistoryGrid() {
                historyGrid.innerHTML = ''; // Limpa a grade antes de preencher
                allNumbers.forEach(num => {
                    const cell = document.createElement('div');
                    // Estiliza a célula do histórico
                    cell.className = 'history-cell w-14 h-14 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300';
                    // Adiciona um atributo 'data-number' para encontrar a célula facilmente
                    cell.setAttribute('data-number', num);
                    cell.textContent = num;
                    historyGrid.appendChild(cell);
                });
            }

            /**
             * Reseta o sorteio para o estado inicial.
             */
            function resetSorteio() {
                // Copia todos os números para a lista de disponíveis
                availableNumbers = [...allNumbers];
                drawnNumbersHistory = []; // Limpa o histórico de números sorteados
                
                // Limpa o display principal
                display.textContent = '#';
                display.classList.remove('text-red-500');

                // Reabilita o botão de sortear
                drawButton.disabled = false;
                
                // Desabilita o botão "Ver Operações"
                showOperationsButton.disabled = true;
                
                // Limpa o estilo de "sorteado" da grade de histórico
                document.querySelectorAll('.history-cell').forEach(cell => {
                    cell.classList.remove('drawn');
                });

                // Garante que o modal esteja fechado
                hideOperationsModal();
            }

            /**
             * Sorteia e exibe um novo número.
             */
            function drawNumber() {
                // Verifica se ainda há números disponíveis
                if (availableNumbers.length === 0) {
                    display.textContent = 'FIM!';
                    display.classList.add('text-red-500');
                    drawButton.disabled = true;
                    // Mantém o botão de operações habilitado para o último número
                    return;
                }

                // Sorteia um índice aleatório
                const randomIndex = Math.floor(Math.random() * availableNumbers.length);
                
                // Pega o número sorteado e o remove da lista de disponíveis
                const drawnNumber = availableNumbers.splice(randomIndex, 1)[0];
                
                // Salva o número no histórico de sorteados
                drawnNumbersHistory.push(drawnNumber);

                // Mostra o número no display principal
                display.textContent = drawnNumber;

                // Habilita o botão "Ver Operações"
                showOperationsButton.disabled = false;

                // Marca o número como "sorteado" na grade de histórico
                const historyCell = document.querySelector(`.history-cell[data-number="${drawnNumber}"]`);
                if (historyCell) {
                    historyCell.classList.add('drawn');
                }
            }

            // --- Funções do Modal ---

            /**
             * Mostra o modal com as operações de TODOS os números sorteados.
             */
            function showOperationsModal() {
                // Verifica se algum número já foi sorteado
                if (drawnNumbersHistory.length === 0) return;

                // Define o título
                modalTitle.textContent = 'Operações dos Números Sortados';
                
                // Limpa a lista antiga
                modalList.innerHTML = '';
                
                // Loop sobre cada número na ordem em que foi sorteado
                drawnNumbersHistory.forEach(number => {
                    // Crie um "título" para o número
                    const headerLi = document.createElement('li');
                    headerLi.className = "text-xl font-semibold text-blue-700 mt-4 first:mt-0"; // Estilo para o número
                    headerLi.textContent = `N° ${number}:`;
                    modalList.appendChild(headerLi);

                    // Pega as operações do mapa
                    const ops = operationsMap.get(number) || [];
                    
                    // Adiciona as operações
                    ops.forEach(op => {
                        const opLi = document.createElement('li');
                        opLi.textContent = op;
                        opLi.className = "text-center text-gray-800"; // Estilo para a operação
                        modalList.appendChild(opLi);
                    });
                });

                // Mostra o modal
                operationsModal.classList.remove('hidden');
                operationsModal.classList.add('flex');
            }

            /**
             * Esconde o modal de operações.
             */
            function hideOperationsModal() {
                operationsModal.classList.add('hidden');
                operationsModal.classList.remove('flex');
            }


            // --- Adiciona os Eventos aos Botões ---
            drawButton.addEventListener('click', drawNumber);
            resetButton.addEventListener('click', resetSorteio);
            showOperationsButton.addEventListener('click', showOperationsModal);
            closeModalButton.addEventListener('click', hideOperationsModal);
            
            // --- Inicia o Sorteador ---
            initialize();
        });