export interface FormChooseList {
  afterChange?: Function;
  onChange?: Function;
  defaultList?: any[];
  keyword?: string;
  labelWorld?: string;
  children: React.ReactElement;
  chooseRef?: any;
  type?: selectionType;
  maxLength?: number;
  renderItem?: {
    (arg0: any, arg1: number): JSX.Element;
  };
  chooseItem?: Boolean;
  hideChooseButton?: Boolean;
  value?: any;
  readonly?: Boolean;
  disabled?: Boolean;
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
  needPaging?: Boolean;
  requestFun: Function;
}
