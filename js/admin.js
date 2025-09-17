// Machine Management System
class MachineManager {
    constructor() {
        this.machines = this.loadMachines();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
        this.displayMachines();
        
        // Load sample data if no machines exist
        if (this.machines.length === 0) {
            this.loadSampleData();
        }
    }

    bindEvents() {
        // Form submission
        document.getElementById('machine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMachine();
        });
    }

    loadMachines() {
        const saved = localStorage.getItem('zozikafe_machines');
        return saved ? JSON.parse(saved) : [];
    }

    saveMachines() {
        localStorage.setItem('zozikafe_machines', JSON.stringify(this.machines));
        this.updateStats();
        this.displayMachines();
        
        // Update main website
        this.updateMainWebsite();
    }

    loadSampleData() {
        this.machines = [
            {
                id: 1,
                name: 'La Marzocco Linea Mini',
                type: 'Домашна еспресо машина|Home Espresso Machine',
                description: 'Професионална домашна еспресо машина с двоен бойлер',
                features: [
                    'Двоен бойлер система|Dual Boiler System',
                    'PID контрол на температурата|PID Temperature Control',
                    'Професионална парна дюза|Professional Steam Wand'
                ],
                status: 'available',
                image: '',
                dateAdded: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Nuova Simonelli Aurelia II',
                type: 'Търговска еспресо машина|Commercial Espresso Machine',
                description: 'Търговска клас еспресо машина за кафенета',
                features: [
                    '2-групова търговска класа|2-Group Commercial Grade',
                    'Волуметрично програмиране|Volumetric Programming',
                    'Автоматично почистване с пара|Auto Steam Cleaning'
                ],
                status: 'available',
                image: '',
                dateAdded: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Rancilio Silvia Pro X',
                type: 'Полупрофесионална еспресо машина|Prosumer Espresso Machine',
                description: 'Полупрофесионална машина за сериозни любители',
                features: [
                    'Двоен бойлер|Dual Boiler',
                    'LCD дисплей|LCD Display',
                    'Търговски компоненти|Commercial Components'
                ],
                status: 'sold',
                image: '',
                dateAdded: new Date().toISOString()
            }
        ];
        this.saveMachines();
    }

    saveMachine() {
        const form = document.getElementById('machine-form');
        const formData = new FormData(form);
        
        // Get features
        const features = [];
        const featureInputs = document.querySelectorAll('#features-container input');
        featureInputs.forEach(input => {
            if (input.value.trim()) {
                // Create bilingual feature
                const bg = input.value.trim();
                const en = input.getAttribute('data-en') || bg;
                features.push(`${bg}|${en}`);
            }
        });

        if (features.length === 0) {
            this.showNotification('Моля добавете поне една характеристика!', 'error');
            return;
        }

        const machine = {
            id: this.currentEditId || Date.now(),
            name: formData.get('machine-name'),
            type: formData.get('machine-type'),
            description: formData.get('machine-description') || '',
            features: features,
            status: formData.get('machine-status'),
            image: formData.get('machine-image') || '',
            dateAdded: this.currentEditId ? 
                this.machines.find(m => m.id === this.currentEditId)?.dateAdded || new Date().toISOString() : 
                new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing machine
            const index = this.machines.findIndex(m => m.id === this.currentEditId);
            this.machines[index] = machine;
            this.showNotification('Машината е обновена успешно!', 'success');
            this.currentEditId = null;
        } else {
            // Add new machine
            this.machines.push(machine);
            this.showNotification('Машината е добавена успешно!', 'success');
        }

        this.saveMachines();
        this.clearForm();
    }

    editMachine(id) {
        const machine = this.machines.find(m => m.id === id);
        if (!machine) return;

        this.currentEditId = id;
        
        // Fill form
        document.getElementById('machine-name').value = machine.name;
        document.getElementById('machine-type').value = machine.type;
        document.getElementById('machine-description').value = machine.description;
        document.getElementById('machine-status').value = machine.status;
        document.getElementById('machine-image').value = machine.image;

        // Clear existing features
        const container = document.getElementById('features-container');
        container.innerHTML = '';

        // Add features
        machine.features.forEach(feature => {
            const [bg, en] = feature.split('|');
            this.addFeatureToForm(bg, en);
        });

        // Switch to add machine tab
        showSection('add-machine');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.showNotification('Машината е заредена за редактиране', 'info');
    }

    deleteMachine(id) {
        if (confirm('Сигурни ли сте, че искате да изтриете тази машина?')) {
            this.machines = this.machines.filter(m => m.id !== id);
            this.saveMachines();
            this.showNotification('Машината е изтрита успешно!', 'success');
        }
    }

    toggleMachineStatus(id) {
        const machine = this.machines.find(m => m.id === id);
        if (machine) {
            machine.status = machine.status === 'available' ? 'sold' : 'available';
            this.saveMachines();
            const statusText = machine.status === 'available' ? 'в наличност' : 'продадена';
            this.showNotification(`Машината е маркирана като ${statusText}!`, 'success');
        }
    }

    addFeatureToForm(bgText = '', enText = '') {
        const container = document.getElementById('features-container');
        const featureDiv = document.createElement('div');
        featureDiv.className = 'feature-input';
        featureDiv.innerHTML = `
            <input type="text" placeholder="например: Двоен бойлер система" 
                   value="${bgText}" data-en="${enText}"
                   data-en-placeholder="e.g.: Dual Boiler System">
            <button type="button" onclick="removeFeature(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(featureDiv);
    }

    updateStats() {
        const total = this.machines.length;
        const available = this.machines.filter(m => m.status === 'available').length;
        const sold = this.machines.filter(m => m.status === 'sold').length;

        document.getElementById('total-machines').textContent = total;
        document.getElementById('available-machines').textContent = available;
        document.getElementById('sold-machines').textContent = sold;
    }

    displayMachines() {
        const container = document.getElementById('machines-list');
        
        if (this.machines.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6b5b47;">
                    <i class="fas fa-coffee" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Още няма добавени машини. Използвайте формата по-горе за да добавите първата си машина.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.machines.map(machine => {
            const [typeBg, typeEn] = machine.type.split('|');
            const features = machine.features.map(f => {
                const [bg, en] = f.split('|');
                return bg;
            }).join(', ');

            return `
                <div class="admin-machine-card">
                    <div class="admin-machine-header">
                        <div>
                            <div class="admin-machine-title">${machine.name}</div>
                            <div class="admin-machine-type">${typeBg}</div>
                        </div>
                        <div class="admin-machine-status ${machine.status}">
                            ${machine.status === 'available' ? 'В наличност' : 'Продаден'}
                        </div>
                    </div>
                    
                    ${machine.description ? `<p style="color: #6b5b47; margin-bottom: 1rem; font-size: 0.9rem;">${machine.description}</p>` : ''}
                    
                    <div class="admin-machine-features">
                        <h4>Характеристики:</h4>
                        <ul>
                            ${machine.features.map(f => {
                                const [bg] = f.split('|');
                                return `<li>${bg}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                    
                    <div class="admin-machine-actions">
                        <button class="admin-btn edit" onclick="machineManager.editMachine(${machine.id})">
                            <i class="fas fa-edit"></i> Редактирай
                        </button>
                        <button class="admin-btn toggle" onclick="machineManager.toggleMachineStatus(${machine.id})">
                            <i class="fas fa-exchange-alt"></i> ${machine.status === 'available' ? 'Продай' : 'Върни'}
                        </button>
                        <button class="admin-btn delete" onclick="machineManager.deleteMachine(${machine.id})">
                            <i class="fas fa-trash"></i> Изтрий
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    clearForm() {
        document.getElementById('machine-form').reset();
        document.getElementById('features-container').innerHTML = `
            <div class="feature-input">
                <input type="text" placeholder="например: Двоен бойлер система" data-en-placeholder="e.g.: Dual Boiler System">
                <button type="button" onclick="removeFeature(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        this.currentEditId = null;
    }

    updateMainWebsite() {
        // Store machines for the main website to use
        localStorage.setItem('zozikafe_machines_display', JSON.stringify(this.machines));
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.admin-notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
        `;

        const colors = {
            success: { bg: '#22c55e', text: 'white' },
            error: { bg: '#ef4444', text: 'white' },
            info: { bg: '#3b82f6', text: 'white' }
        };

        const color = colors[type] || colors.info;
        notification.style.backgroundColor = color.bg;
        notification.style.color = color.text;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; padding: 0;">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    document.getElementById(sectionId).style.display = 'block';

    // Update active tab
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

function addFeature() {
    machineManager.addFeatureToForm();
}

function removeFeature(button) {
    const container = document.getElementById('features-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        machineManager.showNotification('Трябва да има поне една характеристика!', 'error');
    }
}

function clearForm() {
    machineManager.clearForm();
}

// Initialize the machine manager
let machineManager;
document.addEventListener('DOMContentLoaded', function() {
    machineManager = new MachineManager();
});

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);