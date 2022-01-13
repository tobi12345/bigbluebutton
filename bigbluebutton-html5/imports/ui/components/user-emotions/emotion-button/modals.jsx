import Modal from '/imports/ui/components/modal/simple/component';
import React, { useState } from 'react';
import { styles } from './styles';
import Button from '/imports/ui/components/button/component';

export const ExperiemtModal = ({ onDismiss, onOk }) => {
    const [checked, setChecked] = useState(false);
  
    return (
      <Modal
        dismiss={{ callback: onDismiss }}
        title="Emotion Recognition Demo"
        style={{width: "800px"}}
      >
        <div>
        <div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, margin: '10px 10px 15px 0px', fontSize: 17,
          }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>What are we doing?</div>
              <div style={{ fontSize: 16 }}>
                We analyze your emotions on your device using your webcam and machine learning 
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>What data are we collecting?</div>
              <div style={{ fontSize: 16 }}>
              every X seconds, userID (no names!), timestamps, emotion results and user agent (optionaly)
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Who has access to the collected data?</div>
              <div style={{ fontSize: 16 }}>
                Only me (Tobias Klesel),
                but Prof. Dr.-Ing. Jörg Ott as my master thesis advisor
                will also see averaged and anonymized data
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="sendPCStats" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="checkbox"
                id="sendPCStats"
                onChange={(e) => setChecked(e.target.checked)}
                checked={checked}
              />
              <span aria-hidden>Send Browser Information (optional, but would realy help)</span>
            </label>
          </div>
          <div style={{ height: 10 }} />
          <div>
            <Button
              label="Start Emotion Recognition"
              className={styles.btn}
              onClick={() => onOk(checked)}
              color="primary"
              size="lg"
            />
          </div>
        </div>
        <div>
        </div>
        </div>
      </Modal>
    );
  };