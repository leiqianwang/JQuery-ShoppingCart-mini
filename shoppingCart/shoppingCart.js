var MyShoppingCart = {
    cartItems: [],
    cartPriceTotal: 0,
    editingIndex: -1, // To track the item being edited

    cartInitialize: function() {
        this.cartItems = [];
        this.cartPriceTotal = 0;
        this.updateCartDisplay();
    },

    addItem: function(item) {
        // Check if item with same name exists
        var existing = this.cartItems.find(i => i.name === item.name);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            this.cartItems.push(item);
        }
        this.updateCartDisplay();
    },

    readItems: function() {
        return this.cartItems;
    },

    updateItem: function(index, newData) {
        if (this.cartItems[index]) {
            this.cartItems[index] = Object.assign(this.cartItems[index], newData);
            this.updateCartDisplay();
        }
    },

    deleteItem: function(index) {
        if (index > -1 && index < this.cartItems.length) {
            this.cartItems.splice(index, 1);
            this.updateCartDisplay();
        }
    },

    calculateSum: function() {
        var sum = 0;
        $.each(this.cartItems, function(idx, item) {
            sum += (item.price * (item.quantity || 1));
        });
        return sum;
    },

    cartTotalPriceUpdate: function() {
        this.cartPriceTotal = this.calculateSum();
        var priceStr = (typeof this.cartPriceTotal === 'number')
            ? this.cartPriceTotal.toFixed(2)
            : '0.00';
        $('.cart-price-total').text('USD ' + priceStr);
    },

    updateCartDisplay: function() {
        var $table = $('.cart-items-table tbody');
        $table.empty();
        $.each(this.cartItems, function(idx, item) {
            var row = '<tr>'
                + '<td>' + item.name + '</td>'
                + '<td>' + item.price.toFixed(2) + '</td>'
                + '<td><input type="number" min="1" class="cart-qty-input" value="' + item.quantity + '" data-index="' + idx + '"></td>'
                + '<td><button class="btn-delete" data-index="' + idx + '">Delete</button></td>'
                + '</tr>';
            $table.append(row);
        });
        MyShoppingCart.cartTotalPriceUpdate();
    }
};

// Document ready
$(function(){
    MyShoppingCart.cartInitialize();

    // Add item event
    $('#add-item-btn').on('click', function(e){
        e.preventDefault();
        var name = $('#item-name').val().trim();
        var price = parseFloat($('#item-price').val());
        var quantity = parseInt($('#item-qty').val());
        if(name && !isNaN(price) && price >= 0 && !isNaN(quantity) && quantity > 0){
            MyShoppingCart.addItem({ name, price, quantity });
            $('#item-name').val('');
            $('#item-price').val('');
            $('#item-qty').val('1');
        } else {
            alert('Please enter valid item details.');
        }
    });

    // Delete item event (delegate)
    $('.cart-items-table').on('click', '.btn-delete', function(){
        var idx = parseInt($(this).data('index'));
        MyShoppingCart.deleteItem(idx);
    });

    // Update quantity event (delegate)
    $('.cart-items-table').on('change', '.cart-qty-input', function(){
        var idx = parseInt($(this).data('index'));
        var newQty = parseInt($(this).val());
        if(newQty > 0){
            MyShoppingCart.updateItem(idx, { quantity: newQty });
        } else {
            alert('Quantity must be at least 1.');
            $(this).val(MyShoppingCart.cartItems[idx].quantity);
        }
    });
});