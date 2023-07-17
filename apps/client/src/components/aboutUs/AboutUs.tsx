import { FC } from 'react';
import './AboutUs.less';
import { Card, Col, Row } from 'antd';

export interface AboutUsProps {}

export const AboutUs: FC<AboutUsProps> = ({}) => {
  return (
    <div className="ds">
      <Row gutter={16}>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={
              <img src="https://images.unsplash.com/photo-1580707221190-bd94d9087b7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" />
            }
          >
            <Card.Meta title="yoal ahroni" description="www.instagram.com" />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={
              <img src="https://images.unsplash.com/photo-1580707221190-bd94d9087b7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" />
            }
          >
            <Card.Meta
              title="ohad ben shimol"
              description="www.instagram.com"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={
              <img src="https://images.unsplash.com/photo-1580707221190-bd94d9087b7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" />
            }
          >
            <Card.Meta title="oriel yemini" description="www.instagram.com" />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={
              <img src="https://images.unsplash.com/photo-1580707221190-bd94d9087b7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" />
            }
          >
            <Card.Meta title="moshe aviten" description="www.instagram.com" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
