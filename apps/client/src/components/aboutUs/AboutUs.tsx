import {FC} from 'react';
import {Card, Row} from 'antd';
import './AboutUs.less';
import {Fade} from "react-awesome-reveal";

export interface AboutUsProps {
}

export const AboutUs: FC<AboutUsProps> = ({}) => {
  return (
    <>
      <Row className="images-con" gutter={16}>
        <Card
          hoverable
          cover={<img src="../../assets/pic.jpeg"/>}
          style={{margin: '1em'}}
        >
          <Card.Meta title="Yoel Ahroni" description="Chief Fun Officer"/>
        </Card>
        <Card
          hoverable
          cover={<img src="../../assets/pic.jpeg"/>}
          style={{margin: '1em'}}
        >
          <Card.Meta title="Ohad Ben Shimol" description="Digital Ninja"/>
        </Card>
        <Card
          hoverable
          cover={<img src="../../assets/pic.jpeg"/>}
          style={{margin: '1em'}}
        >
          <Card.Meta title="Oriel Yemini" description="Algorithm DJ"/>
        </Card>
        <Card
          hoverable
          cover={<img src="../../assets/pic.jpeg"/>}
          style={{margin: '1em'}}
        >
          <Card.Meta title="Moshe Avitan" description="404 Error Therapist"/>
        </Card>
      </Row>
      <div>
        <Fade
          className="fade-con"
          direction="right"
          duration={50}
          cascade
          style={{fontSize: '1.5em'}}
        >
          Our company specializes in cutting-edge facial recognition technology, offering an image-upload
          application that accurately identifies and verifies faces with exceptional precision.
        </Fade>
      </div>
    </>
  );
};

export default AboutUs;
