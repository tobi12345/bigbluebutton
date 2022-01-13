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
                <div style={{ fontWeight: 'bold' }}>How are we doing this?</div>
                <div style={{ fontSize: 16 }}>
                    <img style={{width:"100%",height:"auto"}} src={"/html5client/models/bbbarch.png"}/>
                </div>
            </div>
            <div>
                <div style={{ fontWeight: 'bold' }}>What is an emotion recognition result?</div>
                <div style={{ fontSize: 16 }}>
                    Seven emotions are assigned a value between 0 and 1.<br/>
                    An example could look like this:
                </div>
                <div style={{ fontSize: 11, display:"grid",gridTemplateColumns: "auto auto auto auto",justifyContent:"center",gap:"2px 10px" }}>
                    <div>neutral: </div> <div>0.0000037177412650635233</div>
                    <div>happy: </div> <div>0.999993085861206</div>
                    <div>sad: </div> <div>7.105666668394406e-7</div>
                    <div>angry: </div> <div>0.0000012611731108336244</div>
                    <div>fearful: </div> <div>3 .2339567468397945e-8</div>
                    <div>disgusted: </div> <div>6.416606197490182e-7</div>
                    <div>surprised: </div> <div>4.908182518192916e-7</div>
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
      </Modal>
    );
  };