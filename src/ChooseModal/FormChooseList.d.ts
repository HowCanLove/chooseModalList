export interface FormChooseList {
  // 选择列表后关闭执行的fun
  afterChange?: Function;
  // onChange事件，通常放在form表单里，
  onChange?: Function;
  // 关键rowKey的关键字 默认id
  keyword?: string;
  // 展示内容的关键字，默认label，用户可以传name/title等字段
  labelWorld?: string;
  // 用于点击展开弹窗
  children: React.ReactElement;
  // ref，返回的方法有：getList, reload, show
  chooseRef?: any;
  // 类型 单选/多选
  type?: "radio" | "checkout";
  // 最多选择的length
  maxLength?: number;
  // 选择项目 之后回显的(detail, index) => JSX.Element;
  renderItem?: {
    (detail: any, index: number): JSX.Element;
  };
  // 选择的时候，是否需要返回整个item，如果是false，只返回 currentItem[keyword]
  chooseItem?: Boolean;
  // 选择条数后，是否需要隐藏选择按钮，建议隐藏，默认为true
  hideChooseButton?: Boolean;
  // 默认的列表，form表单高阶组件自己传递进来的参数，如果不在form表单里，也可以自己传递
  value?: any;
  // 只读
  readonly?: Boolean;
  // 禁止编辑
  disabled?: Boolean;
  // 是否需要分页
  needPaging?: Boolean;
  // 请求接口的方法 需要返回的参数是 {rows: [], pageNo: 1, totalCount: 10, pageSize: 5}
  // 如果返回的是一个数组，组件内部则会自动转成上面的方式
  requestFun: Function;
  chooseForm: {
    defaultSelectedRow?: any[];
    columns: ColumnsType<any>;
    bodyHeight?: number;
    maxLength?: number;
    formList?: any[];
    formItem?: React.ReactElement;
    hideChoose?: boolean;
    showMaxLength?: boolean;
    tableConfig?: TableProps<any>;
    modalConfig?: ModalProps;
    title?: string;
    subTitle?: string;
    selectItemRender?: Function | null;
  };
}
