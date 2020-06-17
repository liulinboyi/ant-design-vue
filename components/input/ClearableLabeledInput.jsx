import classNames from 'classnames';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import { getInputClassName } from './Input';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { getComponentFromProp } from '../_util/props-util';

export function hasPrefixSuffix(instance) {
  return !!(
    getComponentFromProp(instance, 'prefix') ||
    getComponentFromProp(instance, 'suffix') ||
    instance.$props.allowClear
  );
}

const ClearableInputType = ['text', 'input'];

const ClearableLabeledInput = {
  props: {
    prefixCls: PropTypes.string,
    inputType: PropTypes.oneOf(ClearableInputType),
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    allowClear: PropTypes.bool,
    element: PropTypes.any,
    handleReset: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    suffix: PropTypes.any,
    prefix: PropTypes.any,
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
  },
  mounted() {
    console.log(this, 'ClearableLabeledInput');
  },
  methods: {
    renderClearIcon(prefixCls) {
      const { allowClear, value, disabled, readOnly, inputType, handleReset } = this.$props;
      if (
        !allowClear ||
        disabled ||
        readOnly ||
        value === undefined ||
        value === null ||
        value === ''
      ) {
        return null;
      }
      const className =
        inputType === ClearableInputType[0]
          ? `${prefixCls}-textarea-clear-icon`
          : `${prefixCls}-clear-icon`;
      return <CloseCircleFilled onClick={handleReset} class={className} role="button" />;
    },

    renderSuffix(prefixCls) {
      const { suffix, allowClear } = this.$props;
      if (suffix || allowClear) {
        return (
          <span class={`${prefixCls}-suffix`}>
            {this.renderClearIcon(prefixCls)}
            {suffix}
          </span>
        );
      }
      return null;
    },

    renderLabeledIcon(prefixCls, element) {
      console.log(element, 'element');

      const props = this.$props;
      const suffix = this.renderSuffix(prefixCls);
      if (!hasPrefixSuffix(this)) {
        return cloneElement(element, {
          props: { value: props.value },
        });
      }

      const prefix = props.prefix ? (
        <span class={`${prefixCls}-prefix`}>{props.prefix}</span>
      ) : null;

      const affixWrapperCls = classNames(props.className, `${prefixCls}-affix-wrapper`, {
        [`${prefixCls}-affix-wrapper-sm`]: props.size === 'small',
        [`${prefixCls}-affix-wrapper-lg`]: props.size === 'large',
        [`${prefixCls}-affix-wrapper-input-with-clear-btn`]:
          props.suffix && props.allowClear && this.$props.value,
      });

      return (
        <span class={affixWrapperCls} style={props.style}>
          {prefix}
          {cloneElement(element, {
            style: null,
            props: { value: props.value },
            class: getInputClassName(prefixCls, props.size, props.disabled),
          })}
          {suffix}
        </span>
      );
    },

    renderInputWithLabel(prefixCls, labeledElement) {
      const { addonBefore, addonAfter, style, size, className } = this.$props;
      console.log(addonBefore, addonAfter, style, size, className);

      // Not wrap when there is not addons
      if (!addonBefore && !addonAfter) {
        return labeledElement;
      }

      const wrapperClassName = `${prefixCls}-group`;
      const addonClassName = `${wrapperClassName}-addon`;
      const addonBeforeNode = addonBefore ? (
        <span class={addonClassName}>{addonBefore}</span>
      ) : null;
      const addonAfterNode = addonAfter ? <span class={addonClassName}>{addonAfter}</span> : null;

      const mergedWrapperClassName = classNames(`${prefixCls}-wrapper`, {
        [wrapperClassName]: addonBefore || addonAfter,
      });

      const mergedGroupClassName = classNames(className, `${prefixCls}-group-wrapper`, {
        [`${prefixCls}-group-wrapper-sm`]: size === 'small',
        [`${prefixCls}-group-wrapper-lg`]: size === 'large',
      });

      // Need another wrapper for changing display:table to display:inline-block
      // and put style prop in wrapper
      return (
        <span class={mergedGroupClassName} style={style}>
          <span class={mergedWrapperClassName}>
            {addonBeforeNode}
            {cloneElement(labeledElement, { style: null })}
            {addonAfterNode}
          </span>
        </span>
      );
    },

    renderTextAreaWithClearIcon(prefixCls, element) {
      const { value, allowClear, className, style } = this.$props;
      if (!allowClear) {
        return cloneElement(element, {
          props: { value },
        });
      }
      const affixWrapperCls = classNames(
        className,
        `${prefixCls}-affix-wrapper`,
        `${prefixCls}-affix-wrapper-textarea-with-clear-btn`,
      );
      return (
        <span class={affixWrapperCls} style={style}>
          {cloneElement(element, {
            style: null,
            props: { value },
          })}
          {this.renderClearIcon(prefixCls)}
        </span>
      );
    },

    renderClearableLabeledInput() {
      const { prefixCls, inputType, element } = this.$props;
      console.log(this.$props, 'this.$props');

      if (inputType === ClearableInputType[0]) {
        console.log(inputType);
        return this.renderTextAreaWithClearIcon(prefixCls, element);
      }
      return this.renderInputWithLabel(prefixCls, this.renderLabeledIcon(prefixCls, element));
    },
  },
  render() {
    return this.renderClearableLabeledInput();
  },
};

export default ClearableLabeledInput;
