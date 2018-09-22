import React from 'react';

import {
  Table, Input, InputNumber, Button, Popconfirm, Form, Icon, Divider,
} from 'antd';

import axios from 'axios';

import { connect } from 'react-redux';

// actions
import {
  loadData, addWordGroup, deleteWordGroup, toggleStatus,
} from '../actions/action';
// import wordGroupsReducer from '../reducers/wordGroupsReducer';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    getInput = () => {
      if (this.props.inputType === 'number') {
        return <InputNumber />;
      }
      return <Input />;
    };

    render() {
      const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        ...restProps
      } = this.props;
      return (
        <EditableContext.Consumer>
          {(form) => {
            const { getFieldDecorator } = form;
            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `Please Input ${title}!`,
                      }],
                      initialValue: record[dataIndex],
                    })(this.getInput())}
                  </FormItem>
                ) : restProps.children}
              </td>
            );
          }}
        </EditableContext.Consumer>
      );
    }
}


class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    const statusIcons = {
      enabledIcon: <Icon type="smile" style={{ fontSize: 24, color: '#52c41a' }} />,
      disabledIcon: <Icon type="frown" style={{ fontSize: 24, color: '#fa541c' }} />,
    };
    this.columns = [
      {
        title: 'Status',
        dataIndex: 'activeState',
        width: '10%',
        className: 'wordsStatus',
        editable: false,
        render: (text, record) => (
          <div>
            {
              record.activeState === true ? (
                statusIcons.enabledIcon
              ) : (
                statusIcons.disabledIcon
              )
                        }
          </div>
        ),
        filters: [{
          text: 'Show enabled',
          value: true,
        }, {
          text: 'Show disabled',
          value: false,
        }],
        onFilter: (value, record) => record.activeState.toString().indexOf(value) === 0,
      },
      {
        title: 'Word Group',
        dataIndex: 'name',
        editable: true,
        width: '71.3%',
        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => this.searchInput = ele}
              placeholder="Search Word Group"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={this.handleSearch(selectedKeys, confirm)}
            />
            <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
            <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            });
          }
        },
        render: (text) => {
          const { searchText } = this.state;
          return searchText ? (
            <span>
              {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                fragment.toLowerCase() === searchText.toLowerCase()
                      ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
              ))}
            </span>
          ) : text;
        },
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Actions',
        // key: 'actions',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div className="actionsCol">
              <span className="changeStatus">
                {
                    record.activeState === true ? (
                      <span>
                        <a onClick={() => this.toggleGroupStatus(record.id, record.name)}>
                          Deactivate
                        </a>
                        <Divider type="vertical" />
                      </span>
                    ) : (
                      <span>
                        <a onClick={() => this.toggleGroupStatus(record.id, record.name)}>
                          Activate
                        </a>
                        <Divider type="vertical" />
                      </span>
                    )
                }
              </span>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.id, record.activeState)}
                        style={{ marginRight: 8 }}
                      >
                          Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.id)}>Edit</a>
              )}
              <span>
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                  <Divider type="vertical" />
                  <a href="javascript:;"> Delete </a>
                </Popconfirm>
              </span>
            </div>
          );
        },
      },
    ];
  }

    state = {
      // editingKey: '',
      stateKey: '',
      // dataSource: [],
      // count: '50',
      pagination: {},
      loading: false,
    };
    // editing word groups

    isEditing = record => record.id === this.state.editingKey;

    edit(id) {
      this.setState({ editingKey: id });
    }

    save(form, id, activeState) {
      form.validateFields((error, row) => {
        if (error) {
          return;
        }
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => id === item.id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          this.setState({ dataSource: newData, editingKey: '' });
        } else {
          newData.push(row);
          this.setState({ dataSource: newData, editingKey: '' });
        }
        // console.log();
        axios.post('http://koctonpab.asuscomm.com:8080/protected/wordgroups/', {
          id,
          name: row.name,
          activeState,
          userId: 0,
        });
      });
    }

    cancel = () => {
      this.setState({ editingKey: '' });
    };

    // searching wordgroups

    handleSearch = (selectedKeys, confirm) => () => {
      confirm();
      this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => () => {
      clearFilters();
      this.setState({ searchText: '' });
    };

    // deleting wordgroups

    handleDelete = (id) => {
      axios.delete(`http://koctonpab.asuscomm.com:8080/protected/wordgroups/${id}`);
      this.props.deleteWordGroup(id);
    };

    // adding new row

    handleAdd = () => {
      // const { count, dataSource } = this.state;
      // console.log(dataSource.props);

      axios.put('http://koctonpab.asuscomm.com:8080/protected/wordgroups/', {
        name: ' New group ',
        activeState: true,
        userId: 1,
      })
        .then((response) => {
          // console.log(response);
          const newWordGroup = response.data;
          // this.setState({
          //   dataSource: [...dataSource, newData],
          //   count: count + 1,
          // });
          this.props.addWordGroup(newWordGroup);
        });
    };

    // saving new row

    handleSave = (row) => {
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => row.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.setState({ dataSource: newData });
    };

    // changing the status of word group

    toggleGroupStatus(id, name) {
      this.setState({ stateKey: id });

      const newData = [...this.props.dataSource.dataSource];
      const index = newData.findIndex(item => id === item.id);
      const item = newData[index];
      item.activeState = !item.activeState;
      newData.splice(index, 1, {
        ...item,
      });

      this.props.toggleStatus(newData);

      this.setState({ stateKey: '' });

      // posting new status to the server
      axios.post('http://koctonpab.asuscomm.com:8080/protected/wordgroups/', {
        id,
        name,
        activeState: item.activeState,
        userId: 0,
      });
    }

    handleTableChange = (pagination, filters, sorter) => {
      const pager = { ...this.state.pagination };
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
      });
      this.loadWordGroups({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    }

    // load data from server

    loadWordGroups = () => {
      // this.setState({ loading: true });

      // const { loadData } = this.props;
      axios({
        method: 'get',
        url: 'http://koctonpab.asuscomm.com:8080/home/wordgroups/',
        responseType: 'json',
      })
        .then((res) => {
          const dataNew = res.data;
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = dataSource.totalCount;
          // const count = dataSource.totalCount;
          // pagination.total = 10;

          this.setState({
            loading: false,
            // dataSource,
            pagination,
            // count,
          });

          this.props.loadData(dataNew);
        });
    };

    componentDidMount() {
      this.loadWordGroups();
    }


    render() {
      const dataSt = this.props.dataSource;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };

      const columns = this.columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
            editing: this.isEditing(record),
          }),
        };
      });
      return (
        <div>
          <Button className="addGroupBtn" onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                + Add new word group
          </Button>
          <Table
            components={components}
            columns={columns}
            rowKey={record => record.id}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSt.dataSource}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>

      );
    }
}

const mapDispatchToProps = dispatch => ({
  loadData: (dataNew) => {
    dispatch(loadData(dataNew));
  },
  addWordGroup: (newWordGroup) => {
    dispatch(addWordGroup(newWordGroup));
  },
  deleteWordGroup: (id) => {
    dispatch(deleteWordGroup(id));
  },
  toggleStatus: (newData) => {
    dispatch(toggleStatus(newData));
  },
});


const mapStateToProps = state => ({
  dataSource: state.wordGroups,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable);
