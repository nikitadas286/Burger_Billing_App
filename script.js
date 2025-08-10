document.addEventListener('DOMContentLoaded', function() {
            // Enable quantity inputs when checkbox is checked
            const burgers = [
                { id: 'classic-burger', qtyId: 'classic-burger-qty', name: 'Classic Burger', price: 100 },
                { id: 'cheese-burger', qtyId: 'cheese-burger-qty', name: 'Cheese Burger', price: 150 },
                { id: 'bacon-burger', qtyId: 'bacon-burger-qty', name: 'Bacon Burger', price: 220 },
                { id: 'veggie-burger', qtyId: 'veggie-burger-qty', name: 'Veggie Burger', price: 120 },
                { id: 'double-burger', qtyId: 'double-burger-qty', name: 'Double Burger', price: 300 }
            ];
            
            const extras = [
                { id: 'fries', name: 'Fries', price: 80 },
                { id: 'onion-rings', name: 'Onion Rings', price: 70 },
                { id: 'soda', name: 'Soda', price: 50 },
                { id: 'milkshake', name: 'Milkshake', price: 90 }
            ];
            
            // Enable quantity inputs when burger is selected
            burgers.forEach(burger => {
                const checkbox = document.getElementById(burger.id);
                const qtyInput = document.getElementById(burger.qtyId);
                
                checkbox.addEventListener('change', function() {
                    qtyInput.disabled = !this.checked;
                    if (!this.checked) {
                        qtyInput.value = 0;
                    } else {
                        qtyInput.value = 1;
                    }
                });
                
                qtyInput.addEventListener('change', function() {
                    if (this.value < 0) this.value = 0;
                });
            });
            
            // Generate bill button click handler
            document.getElementById('generate-bill').addEventListener('click', function() {
                // Validate inputs
                const customerName = document.getElementById('customer-name').value.trim();
                const customerPhone = document.getElementById('customer-phone').value.trim();
                const orderType = document.getElementById('order-type').value;
                
                if (!customerName || !customerPhone || !orderType) {
                    alert('Please fill in all required fields: Name, Phone Number, and Order Type');
                    return;
                }
                
                // Check if at least one item is selected
                let hasItems = false;
                burgers.forEach(burger => {
                    if (document.getElementById(burger.id).checked && 
                        parseInt(document.getElementById(burger.qtyId).value) > 0) {
                        hasItems = true;
                    }
                });
                
                extras.forEach(extra => {
                    if (document.getElementById(extra.id).checked) {
                        hasItems = true;
                    }
                });
                
                if (!hasItems) {
                    alert('Please select at least one item for the order');
                    return;
                }
                
                // Generate the bill
                generateBill();
            });
            
            // Print bill button
            document.getElementById('print-bill').addEventListener('click', function() {
                window.print();
            });
            
            // Generate the bill function
            function generateBill() {
                // Set customer info
                document.getElementById('bill-customer-name').textContent = document.getElementById('customer-name').value;
                document.getElementById('bill-customer-phone').textContent = document.getElementById('customer-phone').value;
                document.getElementById('bill-order-type').textContent = document.getElementById('order-type').options[document.getElementById('order-type').selectedIndex].text;
                
                // Set date
                const now = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                document.getElementById('bill-date').textContent = now.toLocaleDateString('en-US', options);
                
                // Generate order number (simple incrementing for demo)
                const orderNumber = Math.floor(Math.random() * 9000) + 1000;
                document.getElementById('order-number').textContent = orderNumber;
                
                // Clear previous items
                const billItems = document.getElementById('bill-items');
                billItems.innerHTML = '';
                
                let subtotal = 0;
                
                // Add burgers to bill
                burgers.forEach(burger => {
                    const checkbox = document.getElementById(burger.id);
                    const qtyInput = document.getElementById(burger.qtyId);
                    
                    if (checkbox.checked && parseInt(qtyInput.value) > 0) {
                        const quantity = parseInt(qtyInput.value);
                        const total = quantity * burger.price;
                        subtotal += total;
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${burger.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${quantity}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. ${burger.price}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. ${total}</td>
                        `;
                        billItems.appendChild(row);
                    }
                });
                
                // Add extras to bill
                extras.forEach(extra => {
                    const checkbox = document.getElementById(extra.id);
                    
                    if (checkbox.checked) {
                        subtotal += extra.price;
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${extra.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. ${extra.price}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. ${extra.price}</td>
                        `;
                        billItems.appendChild(row);
                    }
                });
                
                // Calculate tax and total
                const taxRate = 0.08;
                const tax = subtotal * taxRate;
                const total = subtotal + tax;
                
                document.getElementById('bill-subtotal').textContent = `Rs. ${subtotal}`;
                document.getElementById('bill-tax').textContent = `Rs. ${tax}`;
                document.getElementById('bill-total').textContent = `Rs. ${total}`;
                
                // Handle special instructions
                const instructions = document.getElementById('instructions').value.trim();
                if (instructions) {
                    document.getElementById('bill-instructions').textContent = instructions;
                    document.getElementById('bill-instructions-container').classList.remove('hidden');
                } else {
                    document.getElementById('bill-instructions-container').classList.add('hidden');
                }
                
                // Show the bill preview
                document.getElementById('bill-preview').classList.remove('hidden');
                document.getElementById('bill-preview').scrollIntoView({ behavior: 'smooth' });
            }
        });