import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'FERPA Compliant',
      description: 'Meets educational privacy standards'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Certified',
      description: 'Independently audited security controls'
    }
  ];

  return (
    <div className="mt-12">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-foreground mb-2">Trusted by Educators</h3>
        <p className="text-sm text-muted-foreground">
          Your security and privacy are our top priorities
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-3">
              <Icon name={feature?.icon} size={20} className="text-success" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">{feature?.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Trust Indicators */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>50,000+ Teachers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="School" size={14} />
            <span>1,200+ Schools</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Award" size={14} />
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;