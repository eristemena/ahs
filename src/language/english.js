module.exports = {
    home: {
        admin: 'Welcome, Admin',
    },
    sidenav: {
        dashboard: 'Home',
        users: 'Users',
        products: 'Products',
        transactions: 'Transactions',
        customers: 'Customers',
        merchant: 'Merchants',
    },
    topnav: {
        language: 'Language',
        logout: 'Log Out',
    },
    search_placeholder: 'Search',
    action: {
        action: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
    },
    users: {
        title: 'Users',
        table: {
            id: 'ID',
            name: 'Name',
            email: 'Email',
            merchant: 'Merchant',
        },
    },
    products: {
        get: {
            title: 'Product',
            add_product: 'ADD PRODUCT',
            table: {
                id: 'ID',
                name: 'Product Name',
                price: 'Price',
                buying_price: 'Buying Price',
                merchant: 'Merchant',
            },
        },
        form: {
            name: 'Name',
            price: 'Price',
            buying_price: 'Buying Price',
            error: {
                name: {
                    empty: 'Name must be filled',
                    lt4: 'Product name must be more than 3 characters'
                },
                price: {
                    empty: 'Price must be filled',
                    NaN: 'Price must be a number'
                },
                buying_price: {
                    empty: 'Buying price must be filled',
                    NaN: 'Buying price must be a number'
                },
            }
        },
    },
    transactions: {
        get: {
            title: 'Transaction',
            add_transaction: 'ADD TRANSACTION',
            table: {
                date: 'Date',
                name: 'Name Product',
                type: 'Type',
                quantity: 'Quantity',
                price: 'Price',
                customer: 'Customer',
            }
        },
        form: {
            date: {
                label: 'Date:',
                placeholder: '--Pick a date--'
            },
            product: {
                label: 'Product:',
                placeholder: '--Pick a product--'
            },
            type: {
                label: 'Type:',
                sell: 'Sell',
                buy: 'Buy'
            },
            quantity: {
                label: 'Quantity:',
            },
            customer: {
                label: 'Customer:',
                placeholder: '--Pick a customer--'
            },
            info: {
                label: 'Additional Info:',
                placeholder: '--Add some additional info here--'
            },
            error: {
                date: 'Date must be selected',
                product: 'Product must be selected',
                customer: 'Customer must be selected'
            }
        }
    },
    customers: {
        get: {
            title: 'Customer',
            add_transaction: 'ADD CUSTOMER',
            table: {
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                address: 'Address'
            }
        },
        form: {
            name: 'Name:',
            email: 'Email:',
            phone: 'Phone:',
            address: 'Address:',
            error: {
                name: 'Name must be filled',
                email: 'Email is invalid',
                phone: {
                    empty: 'Phone must be filled',
                    NaN: 'Phone must be numbers'
                },
                address: {
                    empty: 'Address must be filled',
                    lt4: 'Address must be more than 3 characters'
                }
            }
        }
    },
    button: {
        submit: 'Submit',
        edit: 'Edit',
        cancel: 'Cancel',
        login: 'Login',
        delete: 'Delete Permanently'
    },
    modal: {
        title: 'Warning!',
        message: 'Are you really sure want to delete this item?',
        note: '(Note: You cannot undo this action)'
    },
    alert: {
        error: 'An error occurred',
        product: {
            add: 'Product added successfully',
            edit: 'Product edited successfully',
            delete: 'Product deleted successfully',
        },
        transaction: {
            add: 'Transaksi added successfully',
            edit: 'Transaksi edited successfully',
            delete: 'Transaksi deleted successfully',
        },
        customer: {
            add: 'Konsumen added successfully',
            edit: 'Konsumen edited successfully',
            delete: 'Konsumen deleted successfully',
        }
    }
};
