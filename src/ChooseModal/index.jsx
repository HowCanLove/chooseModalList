import { unionBy } from "loadsh";
import c from "classname";
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Modal, Table, Button, Pagination, message } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

import Form from "./form";

import styles from "./index.module.less";
import useSet from "./useSet";
import { doFunction, selectionType } from "./utils";
import { useDocumentVisibility, usePrevious } from "ahooks";

const ChooseList = (props, ref) => {
  const {
    defaultSelectedRow = [],
    loading = false,
    keyword = "id",
    labelWorld = "label",
    type = selectionType.checkbox,
    list = undefined,
    getList = () => {},
    columns = [],
    bodyHeight = 500,
    onOk = () => {},
    pagination = {},
    maxLength = 10,
    formList = [],
    formItem,
    hideChoose = false,
    saveForm = false,
    showMaxLength = true,
    tableConfig = {},
    modalConfig = {},
    title = "选择内容",
    subTitle = "已选择内容",
    children,
    selectItemRender = false,
    disabledList = [],
    needPaging = true,
    afterClose = () => {},
  } = props;

  useImperativeHandle(ref, () => {
    return {
      show: () => {
        show();
        init();
      },
      setSelectRows,
    };
  });
  const isRadio = type === "radio";
  const hideChooseList = isRadio || hideChoose;
  const chooseListBox = useRef();
  // 存储所有的list，有的选项不在目前已知的列表中。
  const [allList, setAllList] = useState([]);
  const [visible, setVisible] = useState(false);

  // 列表选项的 rowKeys 与 rows
  const [selectedRowKeys, { add, clear, remove }] = useSet([]);
  const [selectRows, setSelectRows] = useState([]);

  // 显示弹窗
  const show = () => setVisible(true);
  // 隐藏弹窗
  const hide = () => setVisible(false);

  // 自动存储list
  useEffect(() => {
    list && setAllList(unionBy(allList, list, keyword));
  }, [list]);

  // 回到页面，如果弹窗是打开的，则重置接口请求
  const documentVisibility = useDocumentVisibility();
  useEffect(() => {
    documentVisibility === "visible" && visible && init();
  }, [documentVisibility]);

  const previous = usePrevious(selectedRowKeys);
  // 根据选择项的rowKeys，配置 selectRows
  useEffect(() => {
    setSelectRows(
      [...selectedRowKeys].map((key) => allList.find((i) => i[keyword] === key))
    );
    setTimeout(() => {
      if (selectedRowKeys?.size > previous?.size) {
        const dom = chooseListBox.current;
        if (dom) {
          const { clientHeight, scrollHeight } = dom;
          if (scrollHeight > clientHeight) {
            dom.scrollTop = scrollHeight - clientHeight;
          }
        }
      }
    }, 300);
  }, [selectedRowKeys]);

  // 点击table列表
  const rowClick = (record, selected) => {
    if (disabledList.find((i) => i[keyword] === record[keyword])) {
      return;
    }
    if (type === selectionType.checkbox) {
      if (selected) {
        if (selectedRowKeys.size >= maxLength) {
          message.warn(`最多只能选${maxLength}条`);
          return false;
        } else {
          add(record[keyword]);
        }
      } else {
        remove(record[keyword]);
      }
    } else {
      clear(record[keyword]);
    }
    return true;
  };

  // 选择配置
  const rowSelection = {
    type,
    selectedRowKeys: [...selectedRowKeys],
    onSelect: rowClick,
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        const addCheckedKeys = changeRows.map((item) => item[keyword]);
        addCheckedKeys.length = maxLength - selectedRowKeys.size;
        add(addCheckedKeys);
      } else {
        const addCheckedKeys = changeRows.map((item) => item[keyword]);
        remove(addCheckedKeys);
      }
    },
    getCheckboxProps: (record) => {
      let result = { disabled: false };
      if (disabledList.find((i) => i[keyword] === record[keyword])) {
        result.disabled = true;
      } else if (type === selectionType.radio) {
      } else {
        if (selectedRowKeys.size >= maxLength) {
          if (!selectedRowKeys.has(record[keyword])) {
            result.disabled = true;
          }
        }
      }
      return result;
    },
  };

  // 弹窗显示初始化
  const init = () => {
    if (defaultSelectedRow.length > maxLength) {
      console.warn(
        "警告：默认选中的条数大于最大选择条数，已对数据进行删减。建议：\n1、放宽最大条数选择\n2、减少默认选择的条数"
      );
    }
    const defaultRows = defaultSelectedRow.slice(0, maxLength);
    clear(defaultRows.map((i) => i[keyword]));
    if (!saveForm || (list && list.length === 0)) {
      getList();
      setAllList(defaultSelectedRow);
    }
  };
  const cancel = () => {
    hide();
    init();
  };

  const button = (
    <div>
      <Button onClick={cancel}>取消</Button>
      <Button
        type="primary"
        onClick={() => {
          onOk(selectRows);
          hide();
        }}
      >
        {selectedRowKeys.size > 0 ? "确定" : "关闭"}
      </Button>
    </div>
  );
  return (
    <>
      <Modal
        {...{
          className: styles.chooseModal,
          width: hideChooseList ? 600 : 900,
          bodyStyle: {
            height: hideChooseList ? "auto" : bodyHeight,
          },
          maskClosable: false,
          ...modalConfig,
          onCancel: cancel,
          destroyOnClose: !saveForm,
          title: (
            <div className={styles.chooseModalTitleGrid}>
              <span>{title}</span>
              {!hideChooseList && <span>{subTitle}</span>}
            </div>
          ),
          footer: null,
          centered: true,
          visible,
          afterClose: afterClose,
        }}
      >
        <div
          className={c(styles.chooseModalTitleGrid, styles.chooseBody)}
          style={{ height: hideChooseList ? "auto" : bodyHeight }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {React.isValidElement(formItem)
              ? formItem
              : formList.length > 0 && (
                  <Form
                    list={formList}
                    formConfig={{
                      layout: "inline",
                      onFinish: getList,
                    }}
                    buttonText="搜索"
                  />
                )}

            <Table
              style={{ marginTop: 20 }}
              loading={loading}
              rowSelection={rowSelection}
              rowKey={(record) => record[keyword]}
              dataSource={list}
              columns={columns}
              scroll={{ x: 300 }}
              pagination={false}
              onRow={(record) => ({
                onClick: (re) => {
                  rowClick(record, !selectedRowKeys.has(record[keyword]));
                },
              })}
              {...tableConfig}
            />
            <div className={styles.choosePaginationWarp}>
              <span>
                {!isRadio && showMaxLength && (
                  <span>
                    最多选择<a> {maxLength} </a>个
                  </span>
                )}
              </span>
              {needPaging && pagination && (
                <Pagination
                  {...pagination}
                  onChange={(page, limit) => getList({ page, limit })}
                  style={{ width: 450, textAlign: "right" }}
                  responsive
                  size="small"
                />
              )}
            </div>
            {hideChooseList && (
              <div className={styles.radioButtonBox}>{button}</div>
            )}
          </div>
          <div
            className={styles.chooseWarp}
            style={{ display: !hideChooseList ? "flex" : "none" }}
          >
            <div className={styles.chooseListBox} ref={chooseListBox}>
              {selectRows.filter(Boolean).map((item) => (
                <div className={styles.chooseItem} key={item[keyword]}>
                  {selectItemRender ? (
                    selectItemRender(item)
                  ) : (
                    <p className={styles.title}>{item[labelWorld]}</p>
                  )}
                  <CloseCircleFilled
                    className={styles.remove}
                    onClick={() => remove(item[keyword])}
                  />
                </div>
              ))}
            </div>
            <div className={styles.chooseButtonWarp}>
              <span>
                已选<a> {selectRows.length} </a>个
              </span>
              {button}
            </div>
          </div>
        </div>
      </Modal>
      {children
        ? React.cloneElement(children, {
            ...children.props,
            onClick: () => {
              const result = doFunction(children.props.onClick);
              if (result === false) return;
              show();
              init();
            },
          })
        : null}
    </>
  );
};

export default forwardRef(ChooseList);
