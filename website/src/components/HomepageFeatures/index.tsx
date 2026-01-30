import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  // jpegSrc: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  // {
  //   title: 'Personalized',
  //   Svg: require('@site/static/img/undraw_visualization_re_1kag.svg').default,
  //   description: (
  //     <>
  //       We personalized to your own health. We use retrieval augmented generation technology to retrieve relevant information from your medical records so that the AI systems provide information relevant to your healthcare conditions.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Private',
  //   Svg: require('@site/static/img/undraw_secure_files_re_6vdh.svg').default,
  //   description: (
  //     <>
  //       We anonymizes your data so your information is kept private. We do not store absolute dates, use blurry location data, and do not keep full personal data. You can be sure that any information we have cannot be referenced back your person.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Powered by LLMs',
  //   Svg: require('@site/static/img/undraw_visionary_technology_re_jfp7.svg').default,
  //   description: (
  //     <>
  //       Powered by state of the art large language models that are fine tuned to biomedical datasets. We also build safeguards in AI to minimize hallucinations and fake information. We strive to create models that truely understand biology and healthcare.
  //     </>
  //   ),
  // },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" style={{ width: '250px', height: 'auto' }} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
