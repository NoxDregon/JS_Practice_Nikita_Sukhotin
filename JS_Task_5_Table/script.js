class Spreadsheet {
    constructor() {
        this.data = [];
        this.rows = 5;
        this.cols = 5;
        this.editingCell = null;
        this.pendingAction = null;
        this.pendingData = null;
        
        this.init();
    }
    
    init() {
        this.loadFromLocalStorage();
        this.render();
        this.attachEventListeners();
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('spreadsheet_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.data = parsed.data;
            this.rows = parsed.rows;
            this.cols = parsed.cols;
        } else {
            this.data = [['']];
            this.rows = 1;
            this.cols = 1;
        }
    }
    
    saveToLocalStorage() {
        localStorage.setItem('spreadsheet_data', JSON.stringify({
            data: this.data,
            rows: this.rows,
            cols: this.cols
        }));
    }
    
    render() {
        const tbody = document.getElementById('table-body');
        tbody.innerHTML = '';
        
        for (let i = 0; i < this.rows; i++) {
            const tr = document.createElement('tr');
            
            for (let j = 0; j < this.cols; j++) {
                const td = document.createElement('td');
                td.textContent = this.data[i][j] || '';
                td.dataset.row = i;
                td.dataset.col = j;
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        }
    }
    
    attachEventListeners() {
        document.getElementById('table-body').addEventListener('dblclick', (e) => {
            if (e.target.tagName === 'TD') {
                this.startEdit(e.target);
            }
        });

        document.getElementById('add-col-btn').onclick = () => this.addColumn();
        document.getElementById('remove-col-btn').onclick = () => this.checkRemoveColumn();
        document.getElementById('add-row-btn').onclick = () => this.addRow();
        document.getElementById('remove-row-btn').onclick = () => this.checkRemoveRow();

        document.getElementById('modal-confirm').onclick = () => {
            if (this.pendingAction === 'removeColumn') this.removeColumn();
            if (this.pendingAction === 'removeRow') this.removeRow();
            this.hideModal();
        };
        
        document.getElementById('modal-cancel').onclick = () => {
            this.pendingAction = null;
            this.pendingData = null;
            this.hideModal();
        };
    }
    
    startEdit(td) {
        if (this.editingCell) return;
        
        const row = parseInt(td.dataset.row);
        const col = parseInt(td.dataset.col);
        const currentValue = this.data[row][col] || '';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        
        td.classList.add('editing');
        td.innerHTML = '';
        td.appendChild(input);
        input.focus();
        
        const save = () => {
            this.data[row][col] = input.value;
            td.textContent = input.value || '';
            td.classList.remove('editing');
            this.saveToLocalStorage();
            this.editingCell = null;
        };
        
        input.onblur = save;
        input.onkeypress = (e) => { if (e.key === 'Enter') save(); };
        
        this.editingCell = { row, col, td, input };
    }
    
    checkRemoveColumn() {
        if (this.cols <= 1) {
            alert('Нельзя удалить последний столбец');
            return;
        }

        const colToRemove = this.cols - 1;
        let hasData = false;
        
        for (let i = 0; i < this.rows; i++) {
            if (this.data[i][colToRemove] && this.data[i][colToRemove].trim() !== '') {
                hasData = true;
                break;
            }
        }
        
        if (hasData) {
            this.pendingAction = 'removeColumn';
            this.showModal('В удаляемом столбце есть данные. Удалить?');
        } else {
            this.removeColumn();
        }
    }
    
    checkRemoveRow() {
        if (this.rows <= 1) {
            alert('Нельзя удалить последнюю строку');
            return;
        }

        const rowToRemove = this.rows - 1;
        let hasData = false;
        
        for (let j = 0; j < this.cols; j++) {
            if (this.data[rowToRemove][j] && this.data[rowToRemove][j].trim() !== '') {
                hasData = true;
                break;
            }
        }
        
        if (hasData) {
            this.pendingAction = 'removeRow';
            this.showModal('В удаляемой строке есть данные. Удалить?');
        } else {
            this.removeRow();
        }
    }
    
    addColumn() {
        this.cols++;
        for (let i = 0; i < this.rows; i++) {
            this.data[i].push('');
        }
        this.render();
        this.saveToLocalStorage();
    }
    
    removeColumn() {
        if (this.cols <= 1) return;
        this.cols--;
        for (let i = 0; i < this.rows; i++) {
            this.data[i].pop();
        }
        this.render();
        this.saveToLocalStorage();
    }
    
    addRow() {
        this.rows++;
        const newRow = [];
        for (let j = 0; j < this.cols; j++) {
            newRow.push('');
        }
        this.data.push(newRow);
        this.render();
        this.saveToLocalStorage();
    }
    
    removeRow() {
        if (this.rows <= 1) return;
        this.rows--;
        this.data.pop();
        this.render();
        this.saveToLocalStorage();
    }
    
    showModal(message) {
        const modal = document.getElementById('modal');
        document.getElementById('modal-message').textContent = message;
        modal.style.display = 'flex';
    }
    
    hideModal() {
        document.getElementById('modal').style.display = 'none';
        this.pendingAction = null;
        this.pendingData = null;
    }
}

document.addEventListener('DOMContentLoaded', () => new Spreadsheet());