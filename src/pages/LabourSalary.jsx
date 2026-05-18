import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, ComposedChart, Line, Legend
} from 'recharts';
import {
    Users, IndianRupee, Clock, AlertTriangle, TrendingDown, TrendingUp,
    Calendar, FileText, Wallet, BarChart3, UserCheck, UserX, Coffee,
    Heart, Star, ChevronDown, ChevronUp, CreditCard, Gift, Briefcase,
    Plus, X, Save
} from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import { useLanguage } from '../context/LanguageContext';

const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'salary', label: 'Salary', icon: IndianRupee },
    { id: 'advances', label: 'Advances', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

const STATUS_COLORS = {
    'Present': '#10b981',
    'Absent': '#ef4444',
    'Half Day': '#f59e0b',
    'Sick Leave': '#3b82f6',
    'Festival Bonus Day': '#8b5cf6',
    '—': 'rgba(255,255,255,0.06)',
};

const REASON_ICONS = {
    'Medical': '🏥',
    'School Fees': '📚',
    'Festival': '🎉',
    'Home Repair': '🏠',
    'Wedding': '💒',
    'Other': '📋',
};


function ScoreBadge({ score }) {
    const level = score >= 80 ? 'excellent' : score >= 60 ? 'satisfactory' : 'attention';
    const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Satisfactory' : 'Needs Attention';
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    return (
        <div className="labour-score-badge" style={{ '--score-color': color }}>
            <div className="labour-score-ring">
                <svg viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0-31.831"
                        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"
                    />
                    <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0-31.831"
                        fill="none" stroke={color} strokeWidth="3"
                        strokeDasharray={`${score}, 100`}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="labour-score-value">{score}</span>
            </div>
            <span className="labour-score-label" style={{ color }}>{label}</span>
        </div>
    );
}

// =================== ADD WORKER MODAL ===================
function AddWorkerModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Paid Worker',
        salaryType: 'Monthly Salary',
        baseSalary: '',
        age: '',
        village: '',
        phone: '',
        emergencyContact: '',
        paymentMethod: 'Bank Transfer',
        cattleAssigned: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.baseSalary) {
            alert('Please fill required fields');
            return;
        }
        onAdd(formData);
        setFormData({
            name: '',
            type: 'Paid Worker',
            salaryType: 'Monthly Salary',
            baseSalary: '',
            age: '',
            village: '',
            phone: '',
            emergencyContact: '',
            paymentMethod: 'Bank Transfer',
            cattleAssigned: '',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Worker</h2>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid-2">
                        <input
                            type="text"
                            placeholder="Worker Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-input"
                        />
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="form-select"
                        >
                            <option value="Paid Worker">Paid Worker</option>
                            <option value="Family Help">Family Help</option>
                            <option value="Daily Wage">Daily Wage</option>
                            <option value="Contract Labour">Contract Labour</option>
                        </select>
                    </div>

                    <div className="form-grid-2">
                        <select
                            value={formData.salaryType}
                            onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                            className="form-select"
                        >
                            <option value="Monthly Salary">Monthly Salary</option>
                            <option value="Daily Wage">Daily Wage</option>
                            <option value="Per Visit">Per Visit</option>
                            <option value="No Cash Payment">No Cash Payment</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Base Salary/Rate *"
                            value={formData.baseSalary}
                            onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div className="form-grid-2">
                        <input
                            type="number"
                            placeholder="Age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Village"
                            value={formData.village}
                            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div className="form-grid-2">
                        <input
                            type="text"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Emergency Contact"
                            value={formData.emergencyContact}
                            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div className="form-grid-2">
                        <select
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            className="form-select"
                        >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="Mobile Wallet">Mobile Wallet</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Cattle Assigned"
                            value={formData.cattleAssigned}
                            onChange={(e) => setFormData({ ...formData, cattleAssigned: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary"><Save size={16} /> Save Worker</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// =================== ADD ATTENDANCE MODAL ===================
function AddAttendanceModal({ isOpen, onClose, workers, onAdd }) {
    const [formData, setFormData] = useState({
        workerId: workers[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            workerId: workers[0]?.id || '',
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
        });
    };

    if (!isOpen || workers.length === 0) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Record Attendance</h2>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <select
                        value={formData.workerId}
                        onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                        className="form-select"
                    >
                        {workers.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="form-input"
                    />

                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="form-select"
                    >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Festival Bonus Day">Festival Bonus Day</option>
                    </select>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary"><Save size={16} /> Record</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// =================== ADD SALARY MODAL ===================
function AddSalaryModal({ isOpen, onClose, workers, onAdd }) {
    const [formData, setFormData] = useState({
        workerId: workers[0]?.id || '',
        daysWorked: '30',
        gross: '',
        netPay: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.gross || !formData.netPay) {
            alert('Please fill required fields');
            return;
        }
        onAdd(formData);
        setFormData({
            workerId: workers[0]?.id || '',
            daysWorked: '30',
            gross: '',
            netPay: '',
        });
    };

    if (!isOpen || workers.length === 0) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Add Salary Record</h2>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <select
                        value={formData.workerId}
                        onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                        className="form-select"
                    >
                        {workers.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Days Worked *"
                        value={formData.daysWorked}
                        onChange={(e) => setFormData({ ...formData, daysWorked: e.target.value })}
                        className="form-input"
                    />

                    <input
                        type="number"
                        placeholder="Gross Salary *"
                        value={formData.gross}
                        onChange={(e) => setFormData({ ...formData, gross: e.target.value })}
                        className="form-input"
                    />

                    <input
                        type="number"
                        placeholder="Net Pay *"
                        value={formData.netPay}
                        onChange={(e) => setFormData({ ...formData, netPay: e.target.value })}
                        className="form-input"
                    />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary"><Save size={16} /> Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// =================== OVERVIEW TAB ===================
function OverviewTab({ workers, salaryRecords }) {
    const totalCost = salaryRecords.reduce((s, r) => s + r.gross, 0);
    const labourCostPerLitre = 5.2;
    const paidWorkers = workers.filter(w => w.salaryType !== 'No Cash Payment').length;
    const familyWorkers = workers.filter(w => w.salaryType === 'No Cash Payment').length;

    return (
        <div className="animate-fade-in">
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon"><IndianRupee size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={totalCost} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Total Salary Paid</div>
                    <div className="stat-card-trend up"><Users size={12} /> {paidWorkers} paid + {familyWorkers} family</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><TrendingDown size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={labourCostPerLitre} prefix="₹" suffix="/L" decimals={1} />
                    </div>
                    <div className="stat-card-label">Labour Cost / Litre</div>
                    <div className="stat-card-trend up">
                        <TrendingDown size={12} /> ₹{(labourCostPerLitre - 0.5).toFixed(1)}/L last month
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><Clock size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={8} suffix=" days" />
                    </div>
                    <div className="stat-card-label">Next Salary Due</div>
                    <div className="stat-card-trend">₹{totalCost.toLocaleString('en-IN')} total</div>
                </div>
                <div className="stat-card red">
                    <div className="stat-card-icon"><AlertTriangle size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={workers.length} />
                    </div>
                    <div className="stat-card-label">Total Workers</div>
                    <div className="stat-card-trend">{salaryRecords.length} salary records</div>
                </div>
            </div>
        </div>
    );
}

// =================== WORKERS TAB ===================
function WorkersTab({ workers, onShowAddWorker }) {
    const [expandedId, setExpandedId] = useState(null);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={onShowAddWorker}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={16} /> Add Worker
                </button>
            </div>

            <div className="labour-workers-grid">
                {workers.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>No workers added yet. Click "Add Worker" to get started.</p>
                    </div>
                ) : (
                    workers.map(w => {
                        const isExpanded = expandedId === w.id;
                        return (
                            <div key={w.id} className={`labour-worker-card ${isExpanded ? 'expanded' : ''}`}>
                                <div className="labour-worker-header" onClick={() => setExpandedId(isExpanded ? null : w.id)}>
                                    <div className="labour-worker-avatar" style={{ background: '#5b7fa520', color: '#5b7fa5', border: '2px solid #5b7fa5' }}>
                                        {w.name.charAt(0)}
                                    </div>
                                    <div className="labour-worker-info">
                                        <div className="labour-worker-name">{w.name}</div>
                                        <span className="labour-worker-type" style={{ background: '#40916c20', color: '#40916c' }}>{w.type}</span>
                                    </div>
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>

                                <div className="labour-worker-stats">
                                    <div className="labour-worker-stat">
                                        <span className="labour-stat-label">Salary Type</span>
                                        <span className="labour-stat-value">{w.salaryType}</span>
                                    </div>
                                    <div className="labour-worker-stat">
                                        <span className="labour-stat-label">Base Rate</span>
                                        <span className="labour-stat-value" style={{ color: '#40916c' }}>
                                            ₹{w.baseSalary.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {w.cattleAssigned > 0 && (
                                        <div className="labour-worker-stat">
                                            <span className="labour-stat-label">Cattle</span>
                                            <span className="labour-stat-value">{w.cattleAssigned} assigned</span>
                                        </div>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div className="labour-worker-details animate-fade-in">
                                        <div className="labour-detail-section">
                                            <h4>Personal Details</h4>
                                            <div className="labour-detail-grid">
                                                <span>Age:</span><span>{w.age || '—'}</span>
                                                <span>Village:</span><span>{w.village || '—'}</span>
                                                <span>Phone:</span><span>{w.phone || '—'}</span>
                                                <span>Emergency:</span><span>{w.emergencyContact || '—'}</span>
                                                <span>Payment Method:</span><span>{w.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// =================== ATTENDANCE TAB ===================
function AttendanceTab({ workers, attendanceData, onShowAddAttendance }) {
    const [selectedWorker, setSelectedWorker] = useState('all');

    const filteredData = selectedWorker === 'all'
        ? attendanceData
        : attendanceData.filter(a => a.workerId === selectedWorker);

    return (
        <div className="animate-fade-in">
            <div className="card mb-24">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title">📅 Attendance Record</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                            className="labour-select"
                            value={selectedWorker}
                            onChange={e => setSelectedWorker(e.target.value)}
                        >
                            <option value="all">All Workers</option>
                            {workers.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        <button onClick={onShowAddAttendance} className="btn-primary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <Plus size={14} /> Record
                        </button>
                    </div>
                </div>

                {attendanceData.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <Calendar size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>No attendance records yet. Click "Record" to add attendance.</p>
                    </div>
                ) : (
                    <div className="labour-attendance-grid">
                        {filteredData.map(att => {
                            const presentDays = att.records.filter(r => r.status === 'Present' || r.status === 'Festival Bonus Day').length;
                            const absentDays = att.records.filter(r => r.status === 'Absent').length;
                            const halfDays = att.records.filter(r => r.status === 'Half Day').length;
                            const sickDays = att.records.filter(r => r.status === 'Sick Leave').length;

                            return (
                                <div key={att.workerId} className="labour-attendance-worker">
                                    <div className="labour-attendance-header">
                                        <span className="labour-attendance-name">{att.workerName}</span>
                                        <div className="labour-attendance-summary">
                                            <span style={{ color: '#40916c' }}>{presentDays}P</span>
                                            <span style={{ color: '#c0392b' }}>{absentDays}A</span>
                                            <span style={{ color: '#d4a039' }}>{halfDays}H</span>
                                            <span style={{ color: '#5b7fa5' }}>{sickDays}S</span>
                                        </div>
                                    </div>
                                    <div className="labour-attendance-cells">
                                        {att.records.slice(0, 10).map((r, i) => (
                                            <div
                                                key={i}
                                                className="labour-attendance-cell"
                                                style={{ background: STATUS_COLORS[r.status] || 'rgba(255,255,255,0.06)' }}
                                                title={`${r.date}: ${r.status}`}
                                            >
                                                <span className="labour-cell-date">{r.date.split('-')[2]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== SALARY TAB ===================
function SalaryTab({ workers, salaryRecords, onShowAddSalary }) {
    const [expandedSlip, setExpandedSlip] = useState(null);

    return (
        <div className="animate-fade-in">
            <div className="card mb-24">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title">💰 Salary Records</h3>
                    <button onClick={onShowAddSalary} className="btn-primary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Plus size={14} /> Add Salary
                    </button>
                </div>

                {salaryRecords.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <IndianRupee size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>No salary records yet. Click "Add Salary" to create one.</p>
                    </div>
                ) : (
                    <div className="labour-salary-table">
                        <div className="labour-salary-header-row">
                            <span>Worker</span>
                            <span>Type</span>
                            <span>Days</span>
                            <span>Gross</span>
                            <span>Net Pay</span>
                            <span></span>
                        </div>
                        {salaryRecords.map(rec => {
                            const isExpanded = expandedSlip === rec.workerId;
                            return (
                                <React.Fragment key={rec.workerId}>
                                    <div className={`labour-salary-row ${isExpanded ? 'expanded' : ''}`} onClick={() => setExpandedSlip(isExpanded ? null : rec.workerId)}>
                                        <span className="labour-salary-name">{rec.name}</span>
                                        <span className="labour-salary-type">{rec.type}</span>
                                        <span>{rec.daysWorked}/30</span>
                                        <span>₹{rec.gross.toLocaleString('en-IN')}</span>
                                        <span className="labour-salary-net">₹{rec.netPay.toLocaleString('en-IN')}</span>
                                        <span>{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                                    </div>

                                    {isExpanded && (
                                        <div className="labour-salary-slip animate-fade-in">
                                            <div className="labour-slip-title">
                                                <FileText size={16} />
                                                Salary Slip — {rec.name}
                                            </div>
                                            <div className="labour-slip-body">
                                                <div className="labour-slip-row">
                                                    <span>Gross Salary</span>
                                                    <span className="labour-slip-amount">₹{rec.gross.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="labour-slip-divider" />
                                                <div className="labour-slip-row net">
                                                    <span>Net Pay</span>
                                                    <span className="labour-slip-amount net">₹{rec.netPay.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        <div className="labour-salary-row total-row">
                            <span className="labour-salary-name">TOTAL</span>
                            <span></span>
                            <span></span>
                            <span>₹{salaryRecords.reduce((s, r) => s + r.gross, 0).toLocaleString('en-IN')}</span>
                            <span className="labour-salary-net">
                                ₹{salaryRecords.reduce((s, r) => s + r.netPay, 0).toLocaleString('en-IN')}
                            </span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// =================== ADVANCES TAB ===================
function AdvancesTab({ advanceLedger }) {
    return (
        <div className="animate-fade-in">
            <div className="grid-3 stagger mb-24">
                <div className="stat-card red">
                    <div className="stat-card-icon"><AlertTriangle size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={advanceLedger.reduce((s, a) => s + a.outstanding, 0)} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Outstanding</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><CreditCard size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={advanceLedger.reduce((s, a) => s + a.amount, 0)} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Total Given</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-card-icon"><TrendingUp size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={advanceLedger.reduce((s, a) => s + a.recovered, 0)} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Recovered</div>
                </div>
            </div>

            <div className="card">
                <h3 className="card-title" style={{ marginBottom: '16px' }}>📒 Advance Ledger</h3>
                {advanceLedger.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <Wallet size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>No advance records yet.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

// =================== ANALYTICS TAB ===================
function AnalyticsTab({ workers, salaryRecords }) {
    const totalSalaries = salaryRecords.reduce((s, r) => s + r.gross, 0);

    return (
        <div className="animate-fade-in">
            <div className="card mb-24">
                <h3 className="card-title" style={{ marginBottom: '16px' }}>👥 Worker Summary</h3>
                <div className="labour-contribution-list">
                    {workers.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            No workers to display
                        </div>
                    ) : (
                        workers.map((w, idx) => {
                            const workerSalaries = salaryRecords.filter(r => r.workerId === w.id);
                            const totalEarned = workerSalaries.reduce((s, r) => s + r.netPay, 0);
                            return (
                                <div key={idx} className="labour-contribution-item">
                                    <div className="labour-contribution-rank" style={{ background: '#5b7fa520', color: '#5b7fa5' }}>
                                        #{idx + 1}
                                    </div>
                                    <div className="labour-contribution-info">
                                        <div className="labour-contribution-name">{w.name}</div>
                                        <div className="labour-contribution-stats">
                                            <span>Type: <strong>{w.type}</strong></span>
                                            <span>Records: <strong>{workerSalaries.length}</strong></span>
                                        </div>
                                    </div>
                                    <div className="labour-contribution-value" style={{ color: '#40916c' }}>
                                        ₹{totalEarned.toLocaleString('en-IN')}
                                        <span className="labour-contribution-label">total earned</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="card">
                <h3 className="card-title" style={{ marginBottom: '16px' }}>📊 Salary Summary</h3>
                <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Salaries</span>
                        <span style={{ fontWeight: 600, color: '#40916c' }}>₹{totalSalaries.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Average per Worker</span>
                        <span style={{ fontWeight: 600 }}>
                            ₹{workers.length > 0 ? Math.round(totalSalaries / workers.length).toLocaleString('en-IN') : '0'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Records</span>
                        <span style={{ fontWeight: 600 }}>{salaryRecords.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =================== MAIN COMPONENT ===================
export default function LabourSalary() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');
    const [workers, setWorkers] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [salaryRecords, setSalaryRecords] = useState([]);
    const [advanceLedger, setAdvanceLedger] = useState([]);

    const [showAddWorker, setShowAddWorker] = useState(false);
    const [showAddAttendance, setShowAddAttendance] = useState(false);
    const [showAddSalary, setShowAddSalary] = useState(false);

    const handleAddWorker = (formData) => {
        const newWorker = {
            id: `W-${Date.now()}`,
            name: formData.name,
            initial: formData.name.charAt(0),
            type: formData.type,
            salaryType: formData.salaryType,
            baseSalary: parseInt(formData.baseSalary),
            age: formData.age || '',
            village: formData.village || '',
            phone: formData.phone || '',
            emergencyContact: formData.emergencyContact || '',
            paymentMethod: formData.paymentMethod,
            cattleAssigned: parseInt(formData.cattleAssigned) || 0,
        };
        setWorkers([...workers, newWorker]);
        setShowAddWorker(false);
    };

    const handleAddAttendance = (formData) => {
        const worker = workers.find(w => w.id === formData.workerId);
        if (!worker) return;

        const existingAttendance = attendanceData.find(a => a.workerId === formData.workerId);
        
        if (existingAttendance) {
            setAttendanceData(attendanceData.map(a =>
                a.workerId === formData.workerId
                    ? { ...a, records: [...a.records, { date: formData.date, status: formData.status }] }
                    : a
            ));
        } else {
            setAttendanceData([...attendanceData, {
                workerId: formData.workerId,
                workerName: worker.name,
                records: [{ date: formData.date, status: formData.status }],
            }]);
        }
        setShowAddAttendance(false);
    };

    const handleAddSalary = (formData) => {
        const worker = workers.find(w => w.id === formData.workerId);
        if (!worker) return;

        const newSalary = {
            workerId: formData.workerId,
            name: worker.name,
            type: worker.salaryType,
            daysWorked: parseInt(formData.daysWorked),
            totalDays: 30,
            gross: parseInt(formData.gross),
            netPay: parseInt(formData.netPay),
        };
        setSalaryRecords([...salaryRecords, newSalary]);
        setShowAddSalary(false);
    };

    const TABS_LIST = [
        { id: 'overview', label: t('overview'), icon: BarChart3 },
        { id: 'workers', label: t('workers'), icon: Users },
        { id: 'attendance', label: t('attendance'), icon: Calendar },
        { id: 'salary', label: t('salary'), icon: IndianRupee },
        { id: 'advances', label: t('advances'), icon: Wallet },
        { id: 'analytics', label: t('analytics'), icon: TrendingUp },
    ];

    return (
        <div className="animate-fade-in">
            {/* Tab Navigation */}
            <div className="labour-tabs mb-24">
                {TABS_LIST.map(tab => (
                    <button
                        key={tab.id}
                        className={`labour-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Modals */}
            <AddWorkerModal
                isOpen={showAddWorker}
                onClose={() => setShowAddWorker(false)}
                onAdd={handleAddWorker}
            />
            <AddAttendanceModal
                isOpen={showAddAttendance}
                onClose={() => setShowAddAttendance(false)}
                workers={workers}
                onAdd={handleAddAttendance}
            />
            <AddSalaryModal
                isOpen={showAddSalary}
                onClose={() => setShowAddSalary(false)}
                workers={workers}
                onAdd={handleAddSalary}
            />

            {/* Tab Content */}
            {activeTab === 'overview' && <OverviewTab workers={workers} salaryRecords={salaryRecords} />}
            {activeTab === 'workers' && <WorkersTab workers={workers} onShowAddWorker={() => setShowAddWorker(true)} />}
            {activeTab === 'attendance' && <AttendanceTab workers={workers} attendanceData={attendanceData} onShowAddAttendance={() => setShowAddAttendance(true)} />}
            {activeTab === 'salary' && <SalaryTab workers={workers} salaryRecords={salaryRecords} onShowAddSalary={() => setShowAddSalary(true)} />}
            {activeTab === 'advances' && <AdvancesTab advanceLedger={advanceLedger} />}
            {activeTab === 'analytics' && <AnalyticsTab workers={workers} salaryRecords={salaryRecords} />}
        </div>
    );
}
