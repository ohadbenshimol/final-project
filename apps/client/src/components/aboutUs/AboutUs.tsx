import { FC } from 'react';
import { Card, Row } from 'antd';
import './AboutUs.less';

export interface AboutUsProps {}

export const AboutUs: FC<AboutUsProps> = ({}) => {
  return (
    <Row className="images-con" gutter={16}>
      <Card
        hoverable
        cover={<img src="../../assets/pic.jpeg" />}
        style={{ margin: '1em' }}
      >
        <Card.Meta title="yoal ahroni" description="www.instagram.com" />
      </Card>
      <Card
        hoverable
        cover={<img src="../../assets/pic.jpeg" />}
        style={{ margin: '1em' }}
      >
        <Card.Meta title="ohad ben shimol" description="www.instagram.com" />
      </Card>
      <Card
        hoverable
        cover={<img src="../../assets/pic.jpeg" />}
        style={{ margin: '1em' }}
      >
        <Card.Meta title="oriel yemini" description="www.instagram.com" />
      </Card>
      <Card
        hoverable
        cover={<img src="../../assets/pic.jpeg" />}
        style={{ margin: '1em' }}
      >
        <Card.Meta title="moshe aviten" description="www.instagram.com" />
      </Card>
    </Row>
  );
};

export default AboutUs;
