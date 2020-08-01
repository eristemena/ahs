import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
} from 'reactstrap';
import { BarChart } from '../../components/Charts';
import { connect } from 'react-redux';
import { getSales } from '../../redux/actions/sale';
import { formatPrice } from '../../utilities';

const GetSales = ({ sale, getSales, stock }) => {
    const [graphWeekCode, setGraphWeekCode] = useState(1);
    const [selectProduct, setSelectProduct] = useState(-1);

    const defBottomLables = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const views = [
        {
            code: 1,
            name: 'This Week',
        },
        {
            code: 2,
            name: 'Last week',
        },
    ];

    useEffect(() => {
        if (selectProduct > 0) {
            getSales(graphWeekCode, selectProduct);
        }
    }, [graphWeekCode, selectProduct]);

    const graphChartDataMapping = (sales) => {
        return selectProduct > 0 && sales.data
            ? [
                  {
                      data: sales.data.data.map(({ spending }) => spending),
                      label: 'Spending',
                      color: {
                          red: 0,
                          green: 142,
                          blue: 204,
                      },
                  },
                  {
                      data: sales.data.data.map(({ income }) => income),
                      label: 'Income',
                      color: {
                          red: 0,
                          green: 202,
                          blue: 204,
                      },
                  },
              ]
            : [];
    };

    return (
        <Card className="shadow mt-3 h-100">
            <CardBody>
                <CardTitle className="d-flex justify-content-between">
                    <h3>Sales</h3>
                    <UncontrolledDropdown>
                        <DropdownToggle className="d-flex justify-content-center justify-content-md-between align-middle dropdown-button dropdown-button-primary outline">
                            <i className="mr-2">
                                {views[graphWeekCode - 1].name}
                            </i>
                            <i className="simple-icon-arrow-down mt-1"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                            {views.map((view) => (
                                <DropdownItem
                                    key={view.code}
                                    onClick={() => setGraphWeekCode(view.code)}>
                                    {view.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </CardTitle>
                <div className="d-flex justify-content-center mb-3 w-100">
                    <Input
                        type="select"
                        value={selectProduct}
                        className="custom-select-not-bootstrap product-sales-select"
                        onChange={(e) => setSelectProduct(e.target.value)}>
                        <option value={-1} disabled>
                            --Select product--
                        </option>
                        {stock.data
                            ? stock.data.map(({ product_id, name }) => (
                                  <option key={product_id} value={product_id}>
                                      {name}
                                  </option>
                              ))
                            : null}
                    </Input>
                </div>
                <BarChart
                    viewCode={graphWeekCode}
                    setViewCode={setGraphWeekCode}
                    view={views}
                    labels={
                        sale.data && sale.data.data 
                            ? sale.data.data.map((s) => s.day)
                            : defBottomLables
                    }
                    data={graphChartDataMapping(sale)}
                    displayLegend={true}
                    legends={['Sales', 'Buys']}
                    title="Price (Rupiah)"
                    customYAxis={formatPrice}
                />
            </CardBody>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    sale: state.sale,
    stock: state.stock,
});

const mapDispatchToProps = (dispatch) => ({
    getSales: (code, product) => dispatch(getSales(code, product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GetSales);
