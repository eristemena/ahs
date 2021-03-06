module.exports = {
	home: {
		admin: 'Welcome, Admin',
	},
	sidenav: {
		dashboard: 'Home',
		users: 'Users',
		products: {
			name: 'Products',
			sub: {
				products: 'Products',
				groups: 'Groups',
			},
		},
		transactions: 'Transactions',
		customers: 'Customers',
		merchant: 'Merchants',
		gallon: 'Gallons',
		reporting: {
			name: 'Reporting',
			sub: {
				borrowing: 'Borrowing',
				sales: 'Sales',
			},
		},
	},
	topnav: {
		language: {
			english: 'English',
			indonesia: 'Indonesia',
		},
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
			button: 'ADD PRODUCT',
			table: {
				id: 'ID',
				name: 'Product Name',
				price: 'Price',
				buying_price: 'Buying Price',
				merchant: 'Merchant',
				group: 'Group',
				no_data: 'There are no products, please add a product.',
			},
		},
		form: {
			name: 'Name',
			price: 'Price',
			buying_price: 'Buying Price',
			error: {
				name: {
					empty: 'Name must be filled',
					lt4: 'Product name must be more than 3 characters',
				},
				price: {
					empty: 'Price must be filled',
					NaN: 'Price must be a number',
				},
				buying_price: {
					empty: 'Buying price must be filled',
					NaN: 'Buying price must be a number',
				},
			},
		},
	},
	transactions: {
		get: {
			title: 'Transaction',
			button: 'ADD TRANSACTION',
			table: {
				date: 'Date',
				name: 'Name Product',
				type: 'Type',
				quantity: 'Quantity',
				price: 'Price',
				customer: 'Customer',
				no_data: 'There are no transactions, please add transactions.',
			},
		},
		form: {
			date: {
				label: 'Date:',
				placeholder: '--Pick a date--',
			},
			product: {
				label: 'Product:',
				placeholder: '--Pick a product--',
			},
			type: {
				label: 'Type:',
				sell: 'Sell',
				buy: 'Buy',
			},
			quantity: {
				label: 'Quantity:',
			},
			customer: {
				label: 'Customer:',
				placeholder: '--Pick a customer--',
			},
			info: {
				label: 'Additional Info:',
				placeholder: '--Add some additional info here--',
			},
			error: {
				date: 'Date must be selected',
				product: 'Product must be selected',
				customer: 'Customer must be selected',
			},
		},
	},
	customers: {
		get: {
			title: 'Customer',
			button: 'ADD CUSTOMER',
			table: {
				name: 'Name',
				email: 'Email',
				phone: 'Phone',
				address: 'Address',
			},
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
					NaN: 'Phone must be numbers',
				},
				address: {
					empty: 'Address must be filled',
					lt4: 'Address must be more than 3 characters',
				},
			},
		},
	},
	gallons: {
		get: {
			title: 'Gallon',
			button: 'ADD STOCK TRANSACTION',
			table: {
				date: 'Date',
				type: 'Type',
				quantity: 'Quantity',
				customer: 'Customer',
				no_data: 'There are no transactions, please add transactions.',
			},
		},
		form: {
			date: {
				name: 'Date',
				placeholder: '--Pick a date--',
			},
			type: {
				name: 'Type',
				sell: 'Sell',
				buy: 'Buy',
				borrow: 'Borrow',
				return: 'Return',
			},
			quantity: 'Quantity',
			customer: {
				name: 'Customer',
				placeholder: '--Pick a customer--',
				noOptions: 'Customer not found',
			},
			info: {
				name: 'Info',
				placeholder: 'Add additional info',
			},
			error: {
				date: 'Date is required',
				customer: 'Customer is required',
			},
		},
	},
	borrowing: {
		title: 'Borrows',
		stock: {
			stock: 'Gallon stock',
			borrowed: 'Total borrowed',
		},
		table: {
			title: 'Borrowers',
			thead: {
				name: 'Name',
				borrows: 'Borrows',
				returns: 'Returns',
				total: 'Total',
			},
		},
	},
	sales: {
		title: 'Sales',
		today: 'Today',
		cards: {
			income: 'Income',
			spending: 'Spending',
			revenue: 'Total',
		},
		table: {
			title: 'Transaction History',
			thead: {
				name: 'Product Name',
				type: 'Type',
				quantity: 'Quantity',
				price: 'Price',
				total: 'Total',
			},
			no_data: ['No transactions today, please', 'add transaction.'],
		},
	},
	button: {
		submit: 'Submit',
		edit: 'Edit',
		cancel: 'Cancel',
		login: 'Login',
		delete: 'Delete Permanently',
	},
	modal: {
		title: 'Warning!',
		message: 'Are you really sure want to delete this item?',
		note: '(Note: You cannot undo this action)',
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
		},
	},
	not_found: [
		`Oops!`,
		`We can't find the page you're looking for.`,
		'Maybe it never exists at all?',
	],
	parse_type: {
		buy: 'Buy',
		sell: 'Sell',
		borrow: 'Borrow',
		return: 'Return',
	},
	groups: {
		get: {
			title: 'Group',
			button: 'ADD GROUP',
			table: {
				name: 'Group Name',
				quantity: 'Quantity',
				merchant: 'Merchant',
				no_data: 'There are no groups, please add a group.',
			},
		},
		form: {
			name: 'Name',
			quantity: 'Quantity',
			error: {
				name: {
					empty: 'Name must be filled',
					lt2: 'Product name must be more than 2 letters',
				},
				quantity: {
					empty: 'Quantity must be filled',
					NaN: 'Quantity must be a number',
				},
			},
		},
	},
};
