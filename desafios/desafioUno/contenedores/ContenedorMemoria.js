const dbConfig = require('../db/config');
const knex = require('knex')(dbConfig.mariaDB);

class ContenedorMemoria {
    constructor() {
        this.elementos = []
        this.id = 0
    }

    async listar(id) {
        const producto = await knex.from('productos').select('id', 'title', 'price', 'thumbnail').whereRaw('id = ??', [id]);
        return producto || { error: `elemento no encontrado` }
    }

    async listarAll() {
        const productos = await knex.from('productos').select('id', 'title', 'price', 'thumbnail');
        const productosRows = productos.map(row => ({ ...row }));
        this.elementos = productosRows;
        return productosRows;
    }

    async guardar(elem) {
        const productoInsert = await knex.from('productos').insert({
            id: this.elementos.length,
            title: elem.title,
            price: elem.price,
            thumbnail: elem.thumbnail
        });
        return productoInsert
    }

    actualizar(elem, id) {
        const newElem = { id: Number(id), ...elem }
        const index = this.elementos.findIndex(p => p.id == id)
        if (index !== -1) {
            this.elementos[index] = newElem
            return newElem
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    borrar(id) {
        const index = this.elementos.findIndex(elem => elem.id == id)
        if (index !== -1) {
            return this.elementos.splice(index, 1)
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    borrarAll() {
        this.elementos = []
    }
}

module.exports = ContenedorMemoria
