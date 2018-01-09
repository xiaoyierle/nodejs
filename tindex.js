import React from 'react';
import Home from '../home/home.js';
import {Table, Upload, Modal, Icon} from 'antd';
class Goods extends React.Component {
    constructor() {
        super();
        this.state = {
            source: []
        }
    }

    componentDidMount() {
        fetch('/get_goods', {
            credentials: 'include'
        }).then(res=>res.json())
            .then(r=> {
                r.forEach(v=> {
                    v.show = false;
                });
                this.setState({
                    source: r
                })
            })
    }

    showModal(gid) {
        var r = this.state.source.map(v=> {
            if (v.gid == gid) {
                v.show = true;
            }
            return v;
        });
        this.setState({source: r})
    }

    hideModel(gid) {
        var r = this.state.source.map(v=> {
            if (v.gid == gid) {
                v.show = false;
            }
            return v;
        });
        this.setState({source: r})
    }

    remove(gid) {
        /////////////
        var r = this.state.source.map(v=> {
            if (v.gid == gid) {
                v.pic = undefined;
            }
            return v;
        });
        this.setState({source: r})
    }

    change(e) {
        console.log(e.file.status);
        // if (e.file.status === 'done') {
        //   alert(e.file.response);
        // }
    }

    render() {
        const tableData = {
            columns: [
                {title: '搴忓彿', dataIndex: 'gid', key: 'id'},
                {title: '鍚嶇О', dataIndex: 'name', key: 'name'},
                {title: '鍒嗙被', dataIndex: 'cname', key: 'cate_id'},
                {
                    title: '鍥剧墖', key: 'pic', render: record=> {
                    const o = [];
                    if (record.pic) {
                        o.push({
                            uid: -1,
                            url: record.pic
                        })
                    }
                    return (
                        <div>
                            <Upload
                                name="abc"
                                action="/update_pic"
                                listType="picture-card"
                                fileList={o}
                                data={{id: record.gid}}
                                onPreview={()=>this.showModal(record.gid)}
                                onRemove={()=>this.remove(record.gid)}
                                onChange={(e)=> this.change(e)}
                            >

                                {o.length ? null : (
                                    <div>
                                        <Icon type="plus" style={{fontSize: 20}}/>
                                        鐐瑰嚮涓婁紶
                                    </div>
                                )}
                            </Upload>
                            <Modal visible={record.show}
                                   onCancel={()=>this.hideModel(record.gid)}
                                   footer={null}>
                                <img width="100%" src={record.pic} alt=""/>
                            </Modal>
                        </div>

                    )
                }
                }
            ],
            dataSource: this.state.source
        };
        return (
            <Home selected="goods_manager">
                <Table {...tableData}/>
            </Home>
        )
    }
}
export default Goods;