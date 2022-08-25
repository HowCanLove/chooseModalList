import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ChooseList from "./index";
import { Space, Tag } from "antd";
import { useRequest } from "ahooks";
import { doFunction, getType, selectionType } from "./utils";

const ChooseModal = (props, ref) => {
  const {
    list: defaultSelectedRow = [],
    requestFun,
    onOk,
    needPaging,
    defaultParams = {},
    ...otherProps
  } = props;
  const [query, setQuery] = useState({});
  const [data, setData] = useState({});
  const { loading, run: getList } = useRequest(
    (params) => {
      const newParams = { ...query, ...params };
      console.log(newParams, params, defaultParams, [{ pageNo: 1, pageSize: 5, ...defaultParams }],);
      Object.keys(newParams).forEach((i) => {
        ["", undefined, null].includes(newParams[i]) && delete newParams[i];
      });
      setQuery(newParams);
      return requestFun(newParams);
    },
    {
      manual: true,
      defaultParams: [{ pageNo: 1, pageSize: 5, ...defaultParams }],
      onSuccess: (res) => {
        // 也有可能会有不分页的场景
        if (Array.isArray(res)) {
          setData({
            rows: res,
            totalCount: res.length,
          });
        } else {
          setData(res);
        }
      },
    }
  );

  const { rows = [], pageSize = 5, pageNo = 1, totalCount = 0 } = data || {};

  const chooseModalRef = useRef();
  useImperativeHandle(ref, () => {
    return {
      getList,
      reload: () => getList(query),
      setList: onOk,
      show: () => doFunction(chooseModalRef.current?.show),
      setSelectRows: (list = []) =>
        doFunction(chooseModalRef.current?.setSelectRows, list),
    };
  });
  return (
    <ChooseList
      loading={loading}
      ref={chooseModalRef}
      pagination={{
        pageSize,
        current: pageNo,
        total: totalCount,
        showSizeChanger: false,
      }}
      needPaging={needPaging}
      list={rows}
      getList={(params = {}) => {
        const { limit = 5, page = 1, ...otherParams } = params;
        return getList({ pageSize: limit, pageNo: page, ...otherParams });
      }}
      tableConfig={{}}
      defaultSelectedRow={defaultSelectedRow}
      onOk={onOk}
      afterClose={() => {
        setQuery({
          ...query,
          ...defaultParams,
        });
      }}
      {...otherProps}
    />
  );
};
const ForWardChooseBlogger = forwardRef(ChooseModal);

function FormChooseList(props) {
  const {
    value,
    readonly = false,
    disabled = false,
    afterChange = () => {},
    onChange = () => {},
    requestFun = () => {},
    keyword = "id",
    labelWorld = "label",
    children = <Button>选择</Button>,
    chooseForm = {},
    chooseRef = useRef(),
    chooseItem = true,
    hideChooseButton = true,
    type = selectionType.radio,
    needPaging = true,
    maxLength = type === selectionType.radio ? 1 : 10,
    defaultParams={}
  } = props;

  const list =
    getType(value) === "object"
      ? [value]
      : getType(value) === "array"
      ? value
      : [];
  let renderItem = (item) => (
    <Tag
      closable={!disabled && !readonly}
      key={item[keyword]}
      onClose={() => {
        doFunction(
          onChange,
          list.filter((i) => i[keyword] !== item[keyword])
        );
      }}
    >
      {item[labelWorld] || "-"}
    </Tag>
  );
  if (props.renderItem) {
    renderItem = props.renderItem;
  }

  return (
    <>
      {list.map((item, index) => {
        if (type === selectionType.radio) {
          return (
            <Space key={item[keyword]}>
              {renderItem(item, index)}
              {!readonly && !disabled && (
                <a
                  onClick={() => {
                    chooseRef.current?.show();
                  }}
                >
                  更改
                </a>
              )}
            </Space>
          );
        }
        return renderItem(item, index);
      })}
      <span hidden={hideChooseButton && list.length >= maxLength}>
        <ForWardChooseBlogger
          requestFun={requestFun}
          children={disabled || readonly ? <span /> : children}
          list={list}
          ref={chooseRef}
          maxLength={maxLength}
          type={type}
          keyword={keyword}
          labelWorld={labelWorld}
          {...chooseForm}
          defaultParams={defaultParams}
          needPaging={needPaging}
          onOk={(resultList) => {
            let result = resultList.map((i) => i[keyword]);
            if (chooseItem) {
              if (type === selectionType.radio) {
                doFunction(onChange, resultList[0]);
                doFunction(afterChange, resultList[0], resultList);
              } else {
                doFunction(onChange, resultList);
                doFunction(afterChange, resultList, resultList);
              }
            } else {
              if (type === selectionType.radio) {
                result = result[0];
              }
              doFunction(onChange, result);
              doFunction(afterChange, result, resultList);
            }
          }}
        />
      </span>
    </>
  );
}

export default FormChooseList;
