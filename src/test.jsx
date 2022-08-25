import { Button, Form, Input } from "antd";
import React, { useRef } from "react";
// import { FormChooseList } from "../dist";
import { FormChooseList } from "./index";
import { DeleteOutlined } from "@ant-design/icons";
import { Space } from "antd";

import "antd/dist/antd.less";
import "./test.less";

const totalCount = ((Math.random() * 100) | 0) + 1;

async function request(params) {
  const { pageSize, pageNo, name } = params;
  const start = (pageNo - 1) * pageSize;
  if (name) {
    return {
      rows: [{ name: "搜索到的结果", id: 9999 }],
      pageNo: 1,
      totalCount: 1,
      pageSize,
    };
  }
  return {
    rows: [...Array(pageSize).keys()].map((i, index) => ({
      name: `name${start + index + 1}`,
      id: start + index + 1,
    })),
    pageNo,
    totalCount,
    pageSize,
  };
}

function Test() {
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
    },
  ];

  const [form] = Form.useForm();
  const chooseList1 = useRef();
  return (
    <div>
      <Form
        form={form}
        initialValues={{
          test3: [
            { id: 3, name: "name3" },
            { id: 4, name: "name4" },
          ],
          test4: [{ id: 3, name: "name3" }],
          test5: [{ id: 3, name: "name3" }],
          test6: [
            { id: 3, name: "name3" },
            { id: 4, name: "name4" },
          ],
        }}
      >
        <Form.Item name="test1" label="单选 关闭后保存最后的搜索状态">
          <FormChooseList
            chooseForm={{
              columns,
              formItem: (
                <div style={{ padding: 20 }}>
                  <Input.Search
                    placeholder="输入名称"
                    onSearch={(e) => {
                      chooseList1.current.getList({ name: e });
                    }}
                  />
                </div>
              ),
              saveForm: true,
            }}
            defaultParams={{pageSize: 10}}
            hideChooseButton={false}
            keyword="id"
            labelWorld="name"
            requestFun={request}
            chooseRef={chooseList1}
          >
            <Button>选择</Button>
          </FormChooseList>
        </Form.Item>
        <Form.Item name="test2" label="多选">
          <FormChooseList
            chooseForm={{
              columns,
              disabledList: [{ name: "name5", id: 5 }],
              saveForm: true,
              title: "这里是主标题",
              subTitle: "这里是已选多少的副标题",
              formList: [{ name: "name", label: "输入name" }],
            }}
            keyword="id"
            labelWorld="name"
            requestFun={request}
            type="checkbox"
          >
            <Button>选择</Button>
          </FormChooseList>
        </Form.Item>
        <Form.Item name="test3" label="有默认值多选 回显重新渲染">
          <FormChooseList
            chooseForm={{
              columns,
              selectItemRender: (detail) => {
                return (
                  <div key={detail.id} style={{ lineHeight: "18px" }}>
                    <p>这里是重新渲染的Item</p>
                    <p>{detail.name}</p>
                  </div>
                );
              },
            }}
            keyword="id"
            labelWorld="name"
            requestFun={request}
            type="checkbox"
            renderItem={(detail) => {
              return (
                <div key={detail.id}>
                  <Space size={10}>
                    {detail.name}
                    <DeleteOutlined
                      onClick={() => {
                        const list = form.getFieldValue("test3") || [];
                        form.setFieldsValue({
                          test3: list.filter((i) => i.id !== detail.id),
                        });
                      }}
                    />
                  </Space>
                </div>
              );
            }}
          >
            <Button>选择</Button>
          </FormChooseList>
        </Form.Item>
        <Form.Item name="test4" label="有默认值单选">
          <FormChooseList
            chooseForm={{ columns }}
            keyword="id"
            labelWorld="name"
            requestFun={request}
            type="radio"
          >
            <Button>选择</Button>
          </FormChooseList>
        </Form.Item>
        <Form.Item name="test5" label="有默认值单选 禁用">
          <FormChooseList
            chooseForm={{ columns }}
            keyword="id"
            labelWorld="name"
            requestFun={request}
            type="radio"
            readonly
          >
            <Button>选择</Button>
          </FormChooseList>
        </Form.Item>
        <Form.Item name="test6" label="有默认值多选禁用">
          <FormChooseList
            chooseForm={{ columns }}
            keyword="id"
            labelWorld="name"
            requestFun={request}
            type="checkout"
            disabled
          >
            <Button>选择</Button>
          </FormChooseList>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Test;
