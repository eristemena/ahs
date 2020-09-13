import React, { useEffect, useState, Fragment } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import { get } from '../../axios';
import { addAlert } from '../../redux/actions';
import { StockCard } from '../../components/Stocks';

const GetSales = ({ products, loading }) => {
    const [selectProduct, setSelectProduct] = useState(-1);

    return (
        <Fragment>
            {/* <Select
                classNamePrefix="custom-searchable-select home "
                className="mb-3"
                isLoading={loading}
                noOptionsMessage={() => 'Produk tidak ditemukan'}
                options={
                    products
                        ? products.map(({ id, name }) => ({
                              value: id,
                              label: name,
                          }))
                        : []
                }
                onChange={(e) => setSelectProduct(e)}
                // value={{
                //     value: values.id,
                //     label:
                //         values.id > 0
                //             ? ownedCustomers.map((own) => {
                //                   if (
                //                       own.value ===
                //                       values.customer_id
                //                   ) {
                //                       return own.label;
                //                   }
                //               })
                //             : transactionForm.customer
                //                   .placeholder,
                // }}
                isSearchable
            /> */}
            <Row>
                {products && products.map(({id, name, stock}) => (
                    <Col key={id} md={3} sm={6} xs={12} className="mb-2">
                        <StockCard product_name={name} stock={stock} />
                    </Col>
                ))}
            </Row>
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    alert: (message) => dispatch(addAlert(message)),
});

export default connect(null, mapDispatchToProps)(GetSales);
