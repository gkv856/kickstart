import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "../routes.js";

const MyMenu = (props) => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/campaigns/new">
          <Button
            icon="add circle"
            primary={true}
            content="Campaign"
            floated="right"
          />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default MyMenu;
