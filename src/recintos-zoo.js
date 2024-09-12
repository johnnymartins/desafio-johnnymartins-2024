class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [{ especie: '', quantidade: 0 }] },
            { numero: 3, bioma: ['savana e rio', 'savana', 'rio'], tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [{ especie: '', quantidade: 0 }] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEÃO', quantidade: 1 }] }
        ];

        this.animais = {
            'LEÃO': { tamanho: 3, bioma: 'savana', carnívoro: true },
            'LEOPARDO': { tamanho: 2, bioma: 'savana', carnívoro: true },
            'CROCODILO': { tamanho: 3, bioma: 'rio', carnívoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'] },
            'GAZELA': { tamanho: 2, bioma: 'savana' },
            'HIPOPÓTAMO': { tamanho: 4, bioma: ['savana', 'rio'] }
        };
    }

    analisaRecintos(animal, quantidade) {
        
        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida', recintosViaveis: [] };
        }
        const detalhesAnimal = this.animais[animal];
        if (!detalhesAnimal) {
            return { erro: 'Animal inválido', recintosViaveis: [] };
        }

        const recintosViaveis = this.recintos.filter(recinto => {
            // Verifica se o bioma é compatível
            const biomaCompativel = Array.isArray(detalhesAnimal.bioma)
                ? detalhesAnimal.bioma.some(bioma => recinto.bioma.includes(bioma))
                : recinto.bioma.includes(detalhesAnimal.bioma);

            if (!biomaCompativel) return false;

            // Verifica se já há um animal carnívoro no recinto
            const recintoTemCarnivoro = recinto.animaisExistentes.some(a => this.animais[a.especie]?.carnívoro);
            const recintoContemAnimalDiferente = recinto.animaisExistentes.some(a => a.especie && a.especie !== animal);

            // Se o recinto já tem um carnívoro, não pode adicionar outra espécie diferente
            if (recintoTemCarnivoro && recintoContemAnimalDiferente) {
                return false;
            }

            // Se o animal a ser adicionado é carnívoro e o recinto tem uma espécie diferente, não pode adicionar
            if (detalhesAnimal.carnívoro && recintoContemAnimalDiferente) {
                return false;
            }

            // Calcula o espaço ocupado atualmente
            const espacoOcupado = recinto.animaisExistentes.reduce((total, a) => {
                return total + (this.animais[a.especie]?.tamanho || 0) * a.quantidade;
            }, 0);

            // Calcula o espaço necessário para adicionar o novo animal, incluindo o espaço extra
            const espacoAdicional = recinto.animaisExistentes.some(a => a.especie && a.especie !== animal) ? 1 : 0;
            const espacoNecessario = (detalhesAnimal.tamanho * quantidade) + espacoAdicional;

            // Verifica se há espaço suficiente
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;
            return espacoNecessario <= espacoDisponivel;
        });

        // Calcula os recintos viáveis
        const resultados = recintosViaveis.map(recinto => {
            const espacoOcupado = recinto.animaisExistentes.reduce((total, a) => {
                return total + (this.animais[a.especie]?.tamanho || 0) * a.quantidade;
            }, 0);
            const espacoAdicional = recinto.animaisExistentes.some(a => a.especie && a.especie !== animal) ? 1 : 0;
            const espacoNecessario = (detalhesAnimal.tamanho * quantidade) + espacoAdicional;
            const espacoRestante = recinto.tamanhoTotal - espacoOcupado - espacoNecessario;

            return `Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`;
    });

    // Retorna o resultado no formato esperado
    return {
        erro: recintosViaveis.length === 0 ? 'Nenhum recinto disponível' : false,
        recintosViaveis: resultados
}}}

export { RecintosZoo as RecintosZoo }
