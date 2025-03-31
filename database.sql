-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS multi_tools_db;
USE multi_tools_db;

-- Create hs_codes table
CREATE TABLE IF NOT EXISTS hs_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL,
    description TEXT NOT NULL
);

-- Insert sample data
INSERT INTO hs_codes (code, description) VALUES
('8525', 'Transmission apparatus for radio-broadcasting or television, whether or not incorporating reception apparatus or sound recording or reproducing apparatus'),
('8527', 'Reception apparatus for radio-broadcasting, whether or not combined, in the same housing, with sound recording or reproducing apparatus or a clock'),
('8528', 'Monitors and projectors, not incorporating television reception apparatus'),
('8529', 'Parts suitable for use solely or principally with the apparatus of headings 8525 to 8528'),
('8530', 'Electrical signalling, safety or traffic control equipment for railways, tramways, roads, inland waterways, parking facilities, port installations or airfields'),
('8531', 'Electric sound or visual signalling apparatus (for example, bells, sirens, indicator panels, burglar or fire alarms)'),
('8532', 'Electrical capacitors, fixed, variable or adjustable (pre-set)'),
('8533', 'Electrical resistors (including rheostats and potentiometers), other than heating resistors'),
('8534', 'Printed circuits'),
('8535', 'Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits (for example, switches, relays, fuses, surge suppressors, plugs, sockets, lamp-holders and other connectors, junction boxes)'); 