import React from "react";
import { connect } from "react-redux";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";

class MenuList extends React.Component {
  render() {
    const { currentUrl, /* menuConfig, */ layoutConfig, items } = this.props;

    return items.map((child, index) => {
      return (
          <React.Fragment key={`menuList${index}`}>
            {child.section && <MenuSection item={child} />}
            {child.separator && <MenuItemSeparator item={child} />}
            {child.title && (
                <MenuItem
                    item={child}
                    currentUrl={currentUrl}
                    layoutConfig={layoutConfig}
                />
            )}
          </React.Fragment>
      );
    });
  }
}

const mapStateToProps = (state) => ({
  items: state.builder.menuConfig.aside.items
})

export default connect(mapStateToProps)(MenuList)
