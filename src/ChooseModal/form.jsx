import { Button, Form, Input, Select } from "antd";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

const RenderFormItemDom = (props) => {
  const { options, type, ...otherConfig } = props;
  switch (type) {
    case "input":
      return <Input {...otherConfig} />;
    case "select":
      return (
        <Select allowClear {...otherConfig}>
          {options.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      );
    default:
      return null;
  }
};

const RenderFormItem = (props) => {
  const { detail = {}, horizontal } = props;
  const { label, name, required, rules: defaultRules, ...otherConfig } = detail;

  const type = (detail.type || "input").toLocaleLowerCase();

  const placeholder = `请${
    ["input", "textarea"].includes(type) ? "输入" : "选择"
  }${label}`;
  const rules = [];

  if (Array.isArray(defaultRules)) {
    rules.push(...defaultRules);
  } else if (required) {
    rules.push({
      required: true,
      message: `请${
        ["input", "textarea"].includes(type) ? "输入" : "选择"
      }${label}`,
    });
  }
  const itemWidth = horizontal ? 508 : 150;

  return (
    <Form.Item
      {...{
        label,
        name,
        rules,
        style: { marginBottom: 10 },
        ...(horizontal ? formItemLayout : {}),
      }}
    >
      <RenderFormItemDom
        {...{ type, placeholder, style: { width: itemWidth }, ...otherConfig }}
      />
    </Form.Item>
  );
};

export default (props) => {
  const { list, formConfig, buttonConfig, buttonText } = props;
  const [form] = Form.useForm();

  const { layout = "horizontal" } = formConfig;
  const horizontal = layout === "horizontal";

  return (
    <Form {...formConfig} form={form}>
      {list.map((i, index) => (
        <RenderFormItem
          detail={i}
          key={index}
          layout={layout}
          horizontal={horizontal}
        />
      ))}
      {buttonText && (
        <Form.Item
          {...{ wrapperCol: horizontal ? { span: 8, offset: 4 } : {} }}
        >
          <Button type="primary" htmlType="submit" {...buttonConfig}>
            {buttonText}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};
