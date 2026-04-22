let inventory = {};

const productForm = document.getElementById('productForm');
const selectProduct = document.getElementById('selectProduct');
const inventoryTable = document.querySelector('#inventoryTable tbody');

// 1. Registrar Producto
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const stock = parseFloat(document.getElementById('initialStock').value);
    const cost = parseFloat(document.getElementById('initialCost').value);

    if (inventory[code]) {
        alert("Este código de producto ya existe.");
        return;
    }

    inventory[code] = {
        name: name,
        stock: stock,
        avgCost: cost, // Costo Promedio Inicial
        totalValue: stock * cost
    };

    updateUI();
    productForm.reset();
});

// 2. Procesar Movimientos (Ingreso/Salida)
function processMovement(type) {
    const code = selectProduct.value;
    const qty = parseFloat(document.getElementById('moveQty').value);
    const unitCost = parseFloat(document.getElementById('moveCost').value);

    if (!code || isNaN(qty) || qty <= 0) {
        alert("Por favor ingrese datos válidos.");
        return;
    }

    let product = inventory[code];

    if (type === 'in') {
        if (isNaN(unitCost) || unitCost <= 0) {
            alert("Para ingresos se requiere el costo unitario.");
            return;
        }
        
        // Lógica Costo Promedio Ponderado:
        // Nuevo Costo Prom = (Valor Total Actual + Valor de la Compra) / (Stock Actual + Cantidad Compra)
        const newValue = product.totalValue + (qty * unitCost);
        const newStock = product.stock + qty;
        
        product.avgCost = newValue / newStock;
        product.stock = newStock;
        product.totalValue = newValue;

    } else if (type === 'out') {
        if (qty > product.stock) {
            alert("No hay suficiente stock.");
            return;
        }
        // En la salida el costo unitario no cambia, solo disminuye el stock
        product.stock -= qty;
        product.totalValue = product.stock * product.avgCost;
    }

    updateUI();
    document.getElementById('moveQty').value = '';
    document.getElementById('moveCost').value = '';
}

// 3. Actualizar Interfaz
function updateUI() {
    // Actualizar Tabla
    inventoryTable.innerHTML = '';
    selectProduct.innerHTML = '<option value="">-- Seleccione --</option>';

    for (let code in inventory) {
        const prod = inventory[code];
        
        // Fila de la tabla
        const row = `<tr>
            <td><strong>${code}</strong></td>
            <td>${prod.name}</td>
            <td>${prod.stock.toFixed(2)}</td>
            <td>$${prod.avgCost.toFixed(2)}</td>
            <td>$${prod.totalValue.toFixed(2)}</td>
        </tr>`;
        inventoryTable.innerHTML += row;

        // Opciones del select
        const option = `<option value="${code}">${prod.name} (${code})</option>`;
        selectProduct.innerHTML += option;
    }
}