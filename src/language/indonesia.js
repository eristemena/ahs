module.exports = {
    home: {
        admin: 'Selamat Datang, Admin',
    },
    sidenav: {
        dashboard: 'Home',
        users: 'Pengguna',
        products: 'Produk',
        transactions: 'Transaksi',
        customers: 'Konsumen',
        merchant: 'Pedangan',
    },
    topnav: {
        language: 'Bahasa',
        logout: 'Keluar',
    },
    search_placeholder: 'Cari',
    action: {
        action: 'Aksi',
        edit: 'Edit',
        delete: 'Hapus',
    },
    users: {
        title: 'Pengguna',
        table: {
            id: 'ID',
            name: 'Nama',
            email: 'Email',
            merchant: 'Pedagang',
        },
    },
    products: {
        get: {
            title: 'Produk',
            add_product: 'TAMBAH PRODUK',
            table: {
                id: 'ID',
                name: 'Nama Produk',
                price: 'Harga Jual',
                buying_price: 'Harga Beli',
                merchant: 'Pedagang',
            },
        },
        form: {
            name: 'Nama',
            price: 'Harga Jual',
            buying_price: 'Harga Beli',
            error: {
                name: {
                    empty: 'Nama harus diisi',
                    lt4: 'Nama produk harus lebih dari 3 huruf'
                },
                price: {
                    empty: 'Harga jual harus diisi',
                    NaN: 'Harga jual harus angka'
                },
                buying_price: {
                    empty: 'Harga beli harus diisi',
                    NaN: 'Harga beli harus angka'
                },
            }
        },
    },
    transactions: {
        get: {
            title: 'Transaksi',
            add_transaction: 'TAMBAH TRANSAKSI',
            table: {
                date: 'Tanggal',
                name: 'Nama Produk',
                type: 'Tipe',
                quantity: 'Jumlah',
                price: 'Harga',
                customer: 'Konsumen',
            }
        },
        form: {
            date: {
                label: 'Tanggal:',
                placeholder: '--Pilih tanggal--'
            },
            product: {
                label: 'Produk:',
                placeholder: '--Pilih produk--'
            },
            type: {
                label: 'Tipe:',
                sell: 'Jual',
                buy: 'Beli'
            },
            quantity: {
                label: 'Jumlah barang:',
            },
            customer: {
                label: 'Konsumen:',
                placeholder: '--Pilih konsumen'
            },
            info: {
                label: 'Info Tambahan:',
                placeholder: '--Masukan info tambahan disini bila perlu--'
            },
            error: {
                date: 'Tanggal perlu dipilih',
                product: 'Produk perlu dipilih',
                customer: 'Pelanggan perlu dipilih'
            }
        }
    },
    customers: {
        get: {
            title: 'Konsumen',
            add_transaction: 'TAMBAH KONSUMEN',
            table: {
                name: 'Nama',
                email: 'Email',
                phone: 'No Telp.',
                address: 'Alamat'
            }
        },
        form: {
            name: 'Nama:',
            email: 'Email:',
            phone: 'Nomor Telepon:',
            address: 'Alamat:',
            error: {
                name: 'Nama harus diisi',
                email: 'Format email salah',
                phone: {
                    empty: 'Nomor telepon harus diisi',
                    NaN: 'Nomor telepon harus angka'
                },
                address: {
                    empty: 'Alamat perlu diisi',
                    lt4: 'Alamat harus lebih dari 3 huruf'
                }
            }
        }
    },
    button: {
        submit: 'Tambah',
        edit: 'Edit',
        cancel: 'Batal',
        login: 'Masuk',
        delete: 'Hapus Permanen'
    },
    modal: {
        title: 'Peringatan!',
        message: 'Apakah Anda yakin ingin menghapus item ini?',
        note: '(Catatan: Anda tidak dapat membatalkan tindakan ini)'
    },
    alert: {
        error: 'Telah terjadi kesalahan',
        product: {
            add: 'Produk berhasil ditambahkan',
            edit: 'Produk berhasil diedit',
            delete: 'Produk berhasil dihapus',
        },
        transaction: {
            add: 'Transaksi berhasil ditambahkan',
            edit: 'Transaksi berhasil diedit',
            delete: 'Transaksi berhasil dihapus',
        },
        customer: {
            add: 'Konsumen berhasil ditambahkan',
            edit: 'Konsumen berhasil diedit',
            delete: 'Konsumen berhasil dihapus',
        }
    }
};
