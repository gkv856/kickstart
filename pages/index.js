import React from "react";
import factory from "../ethereum/factory.js";
import { Button, Card } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes.js";

class CampaignIndex extends React.Component {
  static async getInitialProps(ctx) {
    const campaigns = await factory.methods.getAllCampaigns().call();
    return { campaigns: campaigns };
  }

  renderCampaigns() {
    // console.log("the props campaign is", this.props.campaigns);
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                content="Create Campaign"
                icon="add circle"
                primary={true}
                labelPosition="left"
                floated="right"
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}
export default CampaignIndex;
